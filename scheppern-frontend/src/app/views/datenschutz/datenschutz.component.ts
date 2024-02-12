import { Component } from '@angular/core';
import { TicketService } from 'src/app/services/ticket-service.service';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.css']
})
export class DatenschutzComponent {
  constructor(
    private ticketService: TicketService,
  ) { 
    this.ticketService.sendHeaders('data_protection');
  }
}
