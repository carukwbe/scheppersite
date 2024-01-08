import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/ticket-service.service';

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
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.ticketService.processTicket(this.id!, 'scan_ticket').subscribe(
      (result) => {
        this.isLoading = false;
        this.success = true;

        this.orderID = result.order_id;
        this.name = result.name;
        this.surname = result.surname;
        this.carpass = result.carpass;
        this.helper = result.helper;
      },
      (error) => {
        this.isLoading = false;
        this.success = false;
        
        this.statusMessage = error;
      }
    )
  }
}
