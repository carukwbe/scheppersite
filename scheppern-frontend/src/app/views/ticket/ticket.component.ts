import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/models';
import { TicketService } from 'src/app/ticket-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {

  isLoading = false;
  statusMessage = '';
  tickets: Ticket[] = [];
  form!: FormGroup;

  constructor(private fb: FormBuilder, private ticketService: TicketService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['+', [Validators.required, Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)]], //nur mit plus erlauben?
      hogwarts_house: ['', Validators.required],
    });

    this.ticketService.getAllTickets().subscribe(
      (tickets) => {
        this.tickets = tickets;
      },
      (error) => {
        console.error('Error getting tickets:', error);
      }
    );
  }

  addTicket() {
    this.isLoading = true;

    this.ticketService.createOrUpdateTicket(this.form.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.statusMessage = result;
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
        console.error(error);
      }
    );
  }

  // temporary 
  routeToTicketEdit(ticket: Ticket) {
    console.log('Route to ticket edit:', ticket.id);
    this.router.navigate(['/ticket/', ticket.id]);
  }
}