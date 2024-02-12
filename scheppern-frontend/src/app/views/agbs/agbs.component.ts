import { Component } from '@angular/core';
import { TicketService } from 'src/app/services/ticket-service.service';

@Component({
  selector: 'app-agbs',
  templateUrl: './agbs.component.html',
  styleUrls: ['./agbs.component.css']
})
export class AgbsComponent {
  constructor(
    private ticketService: TicketService,
  ) { 
    this.ticketService.sendHeaders('agbs');
  }
}
