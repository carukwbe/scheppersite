import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket-service.service';

@Component({
  selector: 'app-ticket-scan',
  templateUrl: './ticket-scan.component.html',
  styleUrls: ['./ticket-scan.component.css']
})
export class TicketScanComponent {
  isLoading = true;
  success = false;
  id: string | null = null;
  statusMessage = "";

  surname: string | null = null;
  name: string | null = null;
  orderID: string | null = null;
  carpass: boolean | null = null;
  helper: boolean | null = null;


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
      this.ticketService.processTicket(this.id!, 'scan_ticket').subscribe(
        (result) => {
          this.isLoading = false;
          this.success = true;
          this.statusMessage = result.message;
    
          this.orderID = result.data.order_id;
          this.name = result.data.name;
          this.surname = result.data.surname;
          this.carpass = result.data.carpass;
          this.helper = result.data.helper;
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
