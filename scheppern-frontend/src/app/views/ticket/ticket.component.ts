import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/models';
import { TicketService } from 'src/app/ticket-service.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  animations: [
    trigger('slideInFromTop', [
      state('void', style({ height: '0', opacity: '-0.5'})),
      state('*', style({ height: '*', opacity: '1'})),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class TicketComponent {
  availableTickets$ = this.ticketService.getAvailableTickets();
  availableHelperTickets = 20;
  // availableCarPasses = 20;
  availableCarPasses = 0;

  // ticketConfig = {
  //   availableTickets = 
  // }
  ticketLevels = [
    { price: 45,
      helperPrice: 22.5,
      active: false,
      name: 'frühe Vogel',
      activationDate: '01.11.2023',
    },
    { price: 50,
      helperPrice: 25,
      active: true,
      name: 'mittel Vogel',
      activationDate: '01.12.2023',
    },
    { price: 55,
      helperPrice: 27.5,
      active: false,
      name: 'späte Vogel',
      activationDate: '01.01.2024',
    }
  ];

  ticketInfos!: FormGroup;
  helperInfos!: FormGroup;

  isLoading = false;
  statusMessage = '';

  currentPrice: number | undefined = undefined;
  currentPriceHelper: number | undefined = undefined;

  // debug
  tickets: Ticket[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router) { }

  ngOnInit(): void {

    this.ticketService.getTicketInfo().subscribe(
      (info) => {
        console.log('Info:', info);
      },
      (error) => {
        console.error('Error getting tickets:', error);
      }
    );
    

    this.currentPrice = this.ticketLevels.find(level => level.active)?.price;
    this.currentPriceHelper = this.ticketLevels.find(level => level.active)?.helperPrice;

    this.ticketInfos = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)]], //nur mit plus erlauben?
      carpass: [{ value: false, disabled: this.availableCarPasses < 1 }],
      carpassWanted: [false],
      helper: [{ value: false, disabled: this.availableHelperTickets < 1 }],
      helperAreas: [[]],
      helperComment: [''],
      timePreferences: [''],
      agbsAccepted: [false, Validators.requiredTrue],
      dataProtectionAccepted: [false, Validators.requiredTrue]
    });

    this.ticketService.getAllTickets().subscribe(
      (tickets) => {
        this.tickets = tickets;
      },
      (error) => {
        console.error('Error getting tickets:', error);
      }
    );
  }

  submit() {
    this.isLoading = true;

    this.ticketService.writeTicket(this.ticketInfos.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.statusMessage = result;
        console.log(result);
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
        console.error(error);
      }
    );
  }

  // temporary 
  routeToTicketEdit(ticket: Ticket) {
    console.log('Route to ticket edit:', ticket.id);
    this.router.navigate(['/ticket/', ticket.id]);
  }

}