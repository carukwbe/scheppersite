import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/ticket-service.service'; 


@Component({
  selector: 'app-ticket-validate',
  templateUrl: './ticket-validate.component.html',
  styleUrls: ['./ticket-validate.component.css']
})
export class TicketValidateComponent {
  isLoading = true;
  succes = false;
  statusMessage = "";

  
  id: string | null = null;
  surname: string | null = null;
  name: string | null = null;

  constructor(
    private ticketService: TicketService, 
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    if (this.id == null) { console.error("No Ticket ID provided"); return; }

    this.ticketService.validateTicket(this.id).subscribe(
      (result) => {
        this.isLoading = false;
        
        this.succes = result.status;
        this.name = result.name;
        this.surname = result.surname;
        this.statusMessage = result.error_msg; //todo change this to message
      },
      (error) => {
        this.isLoading = false;

        this.succes = false;
        this.statusMessage = error;
      }
    )
  }
}
