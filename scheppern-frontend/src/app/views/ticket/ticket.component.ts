import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket, TicketLevel } from 'src/models';
import { TicketService } from 'src/app/ticket-service.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { HelperPopupComponent } from 'src/app/components/helper-popup/helper-popup.component';
import { Global } from 'src/environments/environment';

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
  Global = Global;
  availableTickets$ = this.ticketService.getAvailableTickets();
  availableHelperTickets = 1;
  // availableCarPasses = 20;
  availableCarPasses = 1;

  ticketLevels: TicketLevel[] = [];

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
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {  

    this.ticketService.getTicketInfo().subscribe(
      (data) => { 
        this.ticketLevels = data;
        console.log(data)
        for (const level of this.ticketLevels) {
          if (level.active) {
            this.currentPrice = level.regular_price;
            this.currentPriceHelper = level.helper_price;
          }
        }
      },
      (error) => { console.error('Error getting ticket Info:', error); }
    );
    

    this.ticketInfos = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)]], //nur mit plus erlauben?
      
      carpass: [{ value: false, disabled: this.availableCarPasses < 1 }],
      carpassWish: [false],
      helper: [{ value: false, disabled: this.availableHelperTickets < 1 }],
      helperWish: [false],

      helperShifts: [[]],
      helperInfos: [''],
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
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
        console.error(error);
      }
    );
  }

  openHelperDialog(): void {
    const dialogRef = this.dialog.open(HelperPopupComponent, {
      // data: {name: this.name, animal: this.animal},
      // height: '300px',
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  // temporary 
  routeToTicketEdit(ticket: Ticket) {
    this.router.navigate(['/ticket/', ticket.id]);
  }

}