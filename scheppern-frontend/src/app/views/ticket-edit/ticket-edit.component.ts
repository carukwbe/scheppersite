import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket-service.service';
import { Ticket } from 'src/models';
import { Global } from 'src/environments/environment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { emailValidators, nameValidators, phoneValidators, textValidators } from 'src/app/validators';


@Component({
  template: `
    <h1 mat-dialog-title>Willst du das Ticket für {{ ticket.name }} {{ ticket.surname }} wirklich stornieren?</h1>
    <mat-dialog-actions align="end">
      <button mat-button (click)="this.dialogRef.close(true)" cdkFocusInitial>Ja</button>
      <button mat-button mat-dialog-close>Nein</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class CloseDialog {
  constructor(public dialogRef: MatDialogRef<CloseDialog>, @Inject(MAT_DIALOG_DATA) public ticket: Ticket) { }
}

@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css'],
  animations: [
    trigger('slideInFromTop', [
      state('void', style({ height: '0', margin: '0'})),
      state('*', style({ height: '*', margin: '*'})),
      transition('void => *', animate('200ms ease-out')),
      transition('* => void', animate('200ms ease-out'))
    ]),
    trigger('slideInFromTopWithOpacity', [
      state('void', style({ height: '0', margin: '0', opacity: '-0.5'})),
      state('*', style({ height: '*', margin: '*', opacity: '*'})),
      transition('void => *', animate('200ms ease-out')),
      transition('* => void', animate('200ms ease-out'))
    ])
  ]
})
export class TicketEditComponent implements OnInit {
  Global = Global;

  displayedColumns: string[] = ['key', 'value'];
  tableInfos: { 'key': string, 'value': string }[] | null = null;

  isLoading = true;
  isDeleted = false;
  statusMessage = '';
  isLoadingDelete = false;
  statusMessageDelete = '';

  id = '';
  form!: FormGroup;
  ticket: Ticket | null = null;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ticketService.sendHeaders('ticket_edit');
    
    this.route.params.subscribe((params) => { 
      if (/^[a-zA-Z0-9]{20}$/.test(params['id'])) {
        this.id = params['id'];
        this.getTicket(this.id);
      } else {
        this.isLoading = false;
        this.statusMessage = 'Ticket ID hat ein inkorrektes Format, wende dich an die IT.';
      }
    });
  }

  getTicket(id: string): void {
    this.ticketService.getSingleTicket(id).subscribe(
      (ticket) => {
        console.log(ticket);
        this.isLoading = false;

        this.ticket = ticket;
        this.initializeForm(ticket);
        this.tableInfos = [
          { key: 'Ticket ID',     value: ticket.id!             },
          { key: 'Bestellnummer', value: ticket.order_id!       },
          { key: 'Carpass',       value: ticket.carpass ? 'Ja' : 'Nein' },
          { key: 'Helfer*in',     value: ticket.helper  ? 'Ja' : 'Nein' },
          { key: 'Preis',         value: ticket.price!.toString() + '€' },
          { key: 'Bezahlt',       value: ticket.status! === 'payed' || ticket.status! === 'scanned' ? 'Ja' : 'Nein' },
          { key: 'Status',        value: ticket.status! }
        ];
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
      }
    );
  }

  initializeForm(ticket: Ticket): void {
    this.form = this.fb.group({
      name:         [ticket.name,          [Validators.required, ...nameValidators]],
      surname:      [ticket.surname,       [Validators.required, ...nameValidators]],
      email:        [ticket.email,         [Validators.required, ...emailValidators]],
      phone:        [ticket.phone,          phoneValidators],
      helperShifts: [ticket.helper_shifts,  Validators.maxLength(20)],
      helperInfos:  [ticket.helper_infos,   textValidators]
    });

    if (ticket.status !== 'payed') {
      this.form.get('email')?.disable();
    }
    if (!ticket.helper) {
      this.form.get('helperShifts')?.disable();
      this.form.get('helperInfos')?.disable();
    }
    if (ticket.status === 'scanned') {
      this.form.disable();
      this.statusMessage = 'Ticket wurde bereits gescannt, daher kannst du es nicht mehr bearbeiten. Wenn du glaubst, dass das ein Fehler ist, dann kontaktiere uns via Kontaktformular!';
    }
  }

  getError(controlName: string, errorType: string): boolean {
    const control = this.form.get(controlName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }

  submit(): void {
    this.isLoading = true;
    this.statusMessage = '';

    const inputData = { ...this.form.value, id: this.id };

    console.log(inputData);

    this.ticketService.writeTicket(inputData, true).subscribe(
      status => this.handleSubmit(status),
      error => this.handleSubmit(error)
    );
  }

  handleSubmit(status: string): void {
    this.getTicket(this.id);
    this.isLoading = false;
    this.statusMessage = status;
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(CloseDialog, { width: '500px', data: this.ticket });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteTicket();
        }
      }
    );
  }

  deleteTicket(): void {
    this.isLoadingDelete = true;
    this.statusMessageDelete = '';

    this.ticketService.processTicket(this.id, 'delete_ticket').subscribe(
      status => {
        this.isLoadingDelete = false;
        this.statusMessageDelete = status;
        this.form.disable();
        this.isDeleted = true;
      },
      error => {
        this.isLoadingDelete = false;
        this.statusMessageDelete = error;
      }
    );
  }
}
