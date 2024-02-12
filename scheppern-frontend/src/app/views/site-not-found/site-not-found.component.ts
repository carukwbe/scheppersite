import { Component } from '@angular/core';
import { TicketService } from 'src/app/services/ticket-service.service';

@Component({
  selector: 'app-site-not-found',
  templateUrl: './site-not-found.component.html',
  styleUrls: ['./site-not-found.component.css']
})
export class SiteNotFoundComponent {
  constructor(
    private ticketService: TicketService,
  ) { 
    this.ticketService.sendHeaders('404');
  }
}
