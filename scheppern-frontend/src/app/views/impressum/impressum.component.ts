import { Component } from '@angular/core';
import { TicketService } from 'src/app/services/ticket-service.service';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.css']
})
export class ImpressumComponent {
  constructor(
    private ticketService: TicketService,
  ) { 
    this.ticketService.sendHeaders('impressum');
  }
}
