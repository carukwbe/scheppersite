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

    this.ticketService.getSingleTicket(this.id).subscribe(
      (ticket) => {
        this.isLoading = false;
        if (ticket) {
          console.log(ticket);
          this.ticket = ticket;
          this.oldEmail = ticket.email;
          this.initializeForm(ticket);
          this.tableInfos = [
            { key: 'Ticket ID', value: ticket.id! },
            { key: 'Order ID', value: ticket.order_id! },
            { key: 'Status', value: ticket.status! }
          ];
        } else {
          this.statusMessage = 'Ticket nicht gefunden.';
        }
      },
      (error) => this.handleTicketError(error)
    );
  }

  initializeForm(ticket: Ticket): void {
    this.form = this.fb.group({
      name: [ticket.name, Validators.required],
      surname: [ticket.surname, Validators.required],
      email: [ticket.email, [Validators.required, Validators.email]],
      phone: [ticket.phone, Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)],
      helper: [ticket.helper],
      helperShifts: [ticket.helper_job_preference],
      helperInfos: [ticket.helper_time_preference]
    });
  }

  submit(): void {
    this.isLoading = true;
    this.statusMessage = '';

    const inputData = { ...this.form.value, id: this.id };

    this.ticketService.writeTicket(inputData).subscribe(
      () => this.handleTicketSuccess(),
      (error) => this.handleTicketError(error)
    );
  }

  handleTicketSuccess(): void {
    this.isLoading = false;
    this.statusMessage = 'Ticket saved successfully.';
  }

  handleTicketError(error: any): void {
    this.isLoading = false;
    this.statusMessage = 'Fehler bei der Ticketabfrage: ' + error;
  }
}
