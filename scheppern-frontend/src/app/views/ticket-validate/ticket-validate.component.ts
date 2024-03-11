import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket-service.service';


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
    this.route.params.subscribe((params) => {
      if (/^[a-zA-Z0-9]{20}$/.test(params['id'])) {
        this.id = params['id'];
      } else {
        this.isLoading = false;
        this.statusMessage = 'Ticket ID hat ein inkorrektes Format, wende dich an die IT.';
      }
    });
  }

  ngOnInit() {
    if (this.id) {
      this.ticketService.processTicket(this.id, 'validate_ticket').subscribe(
        (result) => {
          this.isLoading = false;
          this.success = true;

          this.statusMessage = `
            ${result.name} ${result.surname}
            Order ID: ${result.order_id}
            `;

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
}
