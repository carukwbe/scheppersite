import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket, TicketLevel } from 'src/models';
import { TicketService } from 'src/app/ticket-service.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { HelperPopupComponent } from 'src/app/components/helper-popup/helper-popup.component';
import { Global } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
  submitLoading = false;
  statusMessage = '';

  error = false; //todo implement
  errorMessage = ''; 

  ticketLevelError = ''; //todo implement

  ticketQuotas$: Observable<any>;
  counters$: Observable<any>;

  // difference variables: quota - counter
  availableTickets: number | undefined;
  availableHelperTickets: number | undefined;
  availableCarPasses: number | undefined;


  // ticket levels
  ticketLevels$: Observable<TicketLevel[]>;
  activeTicketLevel: TicketLevel | undefined;
 
  // form
  ticketInfos!: FormGroup;
  helperInfos!: FormGroup;

  // debug
  tickets: Ticket[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    public dialog: MatDialog
  ) { 
    this.counters$ = this.ticketService.getFirestoreCollection('counters');
    this.ticketQuotas$ = this.ticketService.getFirestoreCollection('ticket_quotas');
    this.ticketLevels$ = this.ticketService.getTicketLevels();
  }
  
  handleTicketAvailableChange(ticketType: string, availableTickets: number) {
    const ticketControl = this.ticketInfos.get(ticketType);
  
    if (availableTickets < 1) {
      ticketControl?.disable();
      ticketControl?.setValue(false);
    } else {
      ticketControl?.enable();
    }
  }

  ngOnInit(): void {
    this.counters$.subscribe(counters => {
      this.ticketQuotas$.subscribe(quotas => {
        const getCounterValue = (id: string): number => counters.find((item: any) => item.id === id)?.value;
        const getQuotaValue = (id: string): number => quotas.find((item: any) => item.id === id)?.value;
  
        this.availableTickets       = getQuotaValue('regulars' ) - getCounterValue('regulars' );
        console.log("availableTickets: ", );
        this.availableCarPasses     = getQuotaValue('carpasses') - getCounterValue('carpasses');
        this.availableHelperTickets = getQuotaValue('helpers'  ) - getCounterValue('helpers'  );

        this.handleTicketAvailableChange('helper' , this.availableHelperTickets);
        this.handleTicketAvailableChange('carpass', this.availableCarPasses    );
        
        if (!this.availableTickets || this.availableTickets < 1) {
          this.ticketInfos.disable();
        } else {
          this.ticketInfos.enable();
        }
      });
    });
    
    this.ticketLevels$.subscribe((ticketLevels) => {
      this.activeTicketLevel = ticketLevels.find(level => level.active);
      if (!this.activeTicketLevel) this.ticketLevelError = "No active ticket level found";
    });


    this.ticketInfos = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]], //nur mit punkt
      phone: ['', [Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)]], //nur mit plus erlauben?
      
      carpass: [{ value: false, disabled: this.availableCarPasses! < 1 }],
      carpassWish: [false],
      helper: [{ value: false, disabled: this.availableHelperTickets! < 1 }],
      helperWish: [false],

      helperShifts: [[]],
      helperInfos: [''],
      agbsAccepted: [false, Validators.requiredTrue],
      dataProtectionAccepted: [false, Validators.requiredTrue],
      over18: [false, Validators.requiredTrue]
    });



    // debug
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
    this.submitLoading = true;
    this.statusMessage = "";

    this.ticketService.writeTicket(this.ticketInfos.value).subscribe(
      (ticket) => {
        this.submitLoading = false;
        this.statusMessage = "Ticket erfolgreich gespeichert.";
      },
      (error) => {
        this.submitLoading = false;
        this.statusMessage = error;
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
    });
  }

  // temporary 
  routeToTicketEdit(ticket: Ticket) {
    this.router.navigate(['/ticket/', ticket.id]);
  }
}