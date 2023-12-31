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
  success = false;
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
    this.ticketService.processTicket(this.id!, 'validate_ticket').subscribe(
      (result) => {
        this.isLoading = false;
        this.success = true;

        this.name = result.name;
        this.surname = result.surname;
      },
      (error) => {
        this.isLoading = false;
        this.success = false;
        
        this.statusMessage = error;
      }
    )
  }
}
