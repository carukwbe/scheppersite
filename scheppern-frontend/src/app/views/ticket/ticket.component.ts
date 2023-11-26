import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/models';
import { TicketService } from 'src/app/ticket-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  availableTickets$ = this.ticketService.getAvailableTickets();

  ticketInfos!: FormGroup;
  helperInfos!: FormGroup;

  isLoading = false;
  statusMessage = '';

  @ViewChildren('test') testElements: QueryList<ElementRef> | undefined;

  ticketLevels = [
    { price: 45,
      active: false,
      name: 'frühe Vogel',
      activationDate: '01.11.2023',
    },
    { price: 50,
      active: true,
      name: 'mittel Vogel',
      activationDate: '01.12.2023',
    },
    { price: 55,
      active: false,
      name: 'späte Vogel',
      activationDate: '01.01.2024',
    }
  ];

  // debug
  tickets: Ticket[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router) { }

  ngOnInit(): void {

    this.ticketInfos = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)]], //nur mit plus erlauben?
      hogwarts_house: ['', Validators.required],
      helper: [false],
      timePreferences: [''],
      agbsAccepted: [false, Validators.requiredTrue],
      dataProtectionAccepted: [false, Validators.requiredTrue]
    });

    this.helperInfos = this.fb.group({
      isHelper: [false],
      categories: ['', this.isHelper() ? Validators.required : []],
      comment: ['']
    });





    this.ticketService.getAllTickets().subscribe(
      (tickets) => {
        this.tickets = tickets;
      },
      (error) => {
        console.error('Error getting tickets:', error);
      }
    );




    this.ticketService.getTicketLevels().subscribe( data => {
      // console.log('Ticket levels_ges:', data);
      // for (const level of data) {
      //   console.log('Ticket levels:', level)
      // }
    });
  }

  isHelper() {
    if (this.helperInfos) {
      return this.helperInfos.get('isHelper')?.value;
    }
    return false;
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


  ngAfterViewInit() {
    const testElement = this.testElements!.first.nativeElement;
    // if (testElement) {
    //   testElement.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //     inline: "center"
    //   });
    // }
  }
}