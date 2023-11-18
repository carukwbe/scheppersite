import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/ticket-service.service';
import { Ticket } from 'src/models';

@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css']
})
export class TicketEditComponent {  
  isLoading = false;
  statusMessage = '';

  id: string = '';
  ticket: Ticket | null = null;
  form!: FormGroup;

  constructor(
    private ticketService: TicketService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
   }

  ngOnInit(): void {
    this.ticketService.getSingleTicket(this.id).subscribe(
      (ticket) => {
        if (ticket) {
          this.ticket = ticket;
          this.form = this.fb.group({
            name: [ticket.name, Validators.required],
            surname: [ticket.surname, Validators.required],
            email: [ticket.email, [Validators.required, Validators.email]],
            phone: [ticket.phone, Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)],
            hogwarts_house: [ticket.hogwarts_house, Validators.required]
          });
        } else {
          console.log('Ticket not found.');
        }
      },
      (error) => {
        console.error('Error getting ticket details:', error);
      }
    );
  }

  submit(): void {
    this.isLoading = true;
    this.statusMessage = '';

    const inputData = this.form.value;
    inputData.id = this.id;

    this.ticketService.writeTicket(inputData).subscribe(
      (result) => {
        this.isLoading = false;
        this.statusMessage = 'Ticket saved successfully.';
        //todo remove debug
        console.log(result);
        
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = 'Error saving ticket.';
      }
    );
  }

}
