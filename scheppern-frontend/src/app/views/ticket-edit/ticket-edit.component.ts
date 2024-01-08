import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/ticket-service.service';
import { Ticket } from 'src/models';
import { Global } from 'src/environments/environment';

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
  displayedColumns: string[] = ['key', 'value'];
  tableInfos: { 'key': string, 'value': string }[] | null = null;
  Global = Global;
  isLoading = true;
  statusMessage = '';
  oldEmail = '';
  id = '';
  form!: FormGroup;
  ticket: Ticket | null = null;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.id = params['id']));
    this.getTicket(this.id);
  }

  getTicket(id: string): void {
    this.ticketService.getSingleTicket(id).subscribe(
      (ticket) => {
        this.isLoading = false;

        this.ticket = ticket; this.oldEmail = ticket.email;
        
        this.initializeForm(ticket);
        this.tableInfos = [
          { key: 'Ticket ID', value: ticket.id! },
          { key: 'Order ID', value: ticket.order_id! },
          { key: 'Carpass', value: ticket.carpass ? 'Ja' : 'Nein' },
          { key: 'Helfer', value: ticket.helper ? 'Ja' : 'Nein' },
          { key: 'Preis', value: ticket.price!.toString() + '€' },
          { key: 'Bezahlt', value: ticket.status! == 'payed' ? 'Ja' : 'Nein' }
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
      name: [ticket.name, Validators.required],
      surname: [ticket.surname, Validators.required],
      email: [ticket.email, [Validators.required, Validators.email]],
      phone: [ticket.phone, Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)],
      helper: [ticket.helper],
      helperShifts: [ticket.helper_shifts],
      helperInfos: [ticket.helper_infos]
    });
    if (ticket.status != 'payed') {
      this.form.get('email')?.disable();
    }
  }

  submit(): void {
    this.isLoading = true;
    this.statusMessage = '';

    const inputData = { ...this.form.value, id: this.id };

    this.ticketService.writeTicket(inputData, true).subscribe(
      status => this.handleSubmit(status),
      error => this.handleSubmit(error)
    );
  }

  handleSubmit(error: string): void {
    this.getTicket(this.id);
    this.isLoading = false;
    this.statusMessage = error;
  }
}
