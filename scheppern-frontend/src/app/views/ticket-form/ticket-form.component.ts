import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Ticket, TicketForm,  TicketLevel } from 'src/models';
import { TicketService } from 'src/app/services/ticket-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Global } from 'src/environments/environment';
import { Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { emailValidators, nameValidators, phoneValidators, textValidators } from 'src/app/validators';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css'],
  animations: [
    trigger('slideInFromTop', [
      state('void', style({ height: '0', opacity: '-0.5'})),
      state('*', style({ height: '*', opacity: '1'})),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class TicketFormComponent { //todo scret form erstellen!
  Global = Global;

  isLoading = true;
  error = false;
  errorMessage = '';
  isSecret = false;
  
  submitLoading = false;
  statusMessage = '';

  ticketQuotas$: Observable<any> = of([]);
  counters$:     Observable<any> = of([]);

  // difference variables: quota - counter
  availableTickets:       number | undefined;
  availableHelperTickets: number | undefined;
  availableCarPasses:     number | undefined;

  // ticket levels
  ticketLevels$: Observable<TicketLevel[]> = of([]);
  activeTicketLevel: TicketLevel | undefined;

  // debug
  tickets: Ticket[] = [];



  ticketInfos: TicketForm;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { 
    this.ticketInfos = this.fb.group({
      name:    ['', [Validators.required, ...nameValidators]],
      surname: ['', [Validators.required, ...nameValidators]],
      email:   ['', [Validators.required, ...emailValidators]],
      phone:   ['',  phoneValidators],
  
      carpass:      false,
      carpassWish:  false,
      helper:       false,
      helperWish:   false,
  
      helperShifts:           [[] as string[], Validators.maxLength(20)],
      helperInfos:            ['',     textValidators],
      agbsAccepted:           [false,  Validators.requiredTrue],
      dataProtectionAccepted: [false,  Validators.requiredTrue],
      over18:                 [false,  Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isSecret = data['roles'] === 'admin';
    });

    this.counters$ = this.ticketService.getFirestoreCollection('counters').pipe(
      catchError((error) => this.handleError('Fehler bei Zugriff auf Ticketcounters', error))
    );

    this.ticketQuotas$ = this.ticketService.getFirestoreCollection('ticket_quotas').pipe(
      catchError((error) => this.handleError('Fehler bei Zugriff auf Ticketlimits', error))
    );

    this.ticketLevels$ = this.ticketService.getTicketLevels().pipe(
      catchError((error) => this.handleError('Fehler bei Zugriff auf Ticketlevels', error)),
      tap((ticketLevels) => {
        this.activeTicketLevel = ticketLevels.find((level) => level.active);
        if (!this.activeTicketLevel) this.handleError(`
          Kein aktives Ticketlevel gefunden. Das heißt wir können dir gerade keinen Preis anzeigen. 
          Du kannst versuchen dein Ticket abzuschicken, der Preis wird sich irgendwo um die 50€ befinnden.
          Tritt der selbe Fehler auch im Backend auf wird dein Ticket nicht akzeptiert werden können. 
          Kontaktiere uns bitte via Kontaktformular!
        `);
      })
    );

    this.loadTicketData();

    // debug
    this.ticketService.getAllTickets().subscribe(
      (tickets) => {
        this.tickets = tickets;
      },
      (error) => {
        console.error('Error getting tickets:', error);
      }
    );

    // DEBUG
    this.ticketInfos.valueChanges.subscribe((formValues) => {
      // console.log(formValues);
    });

  }

  loadTicketData(): void {
    this.counters$.pipe(
      switchMap(
        (counters) => this.ticketQuotas$.pipe(
          tap((quotas) => {
            if (!counters || counters.length === 0) {
              this.handleError('Ticket Counter konnte nicht ermittelt werden.');
              return;
            }
            if (!quotas || quotas.length === 0) {
              this.handleError('Ticketlimits konnten nicht ermittelt werden.');
              return;
            }

            const getCounterValue = (id: string): number => counters.find((item: any) => item.id === id).value;
            const getQuotaValue = (id: string): number => quotas.find((item: any) => item.id === id).value;

            
            this.availableTickets       = getQuotaValue('regulars')  - getCounterValue('regulars') ;
            this.availableCarPasses     = getQuotaValue('carpasses') - getCounterValue('carpasses');
            this.availableHelperTickets = getQuotaValue('helpers')   - getCounterValue('helpers')  ;

            if (this.isSecret) {
              this.availableTickets       = 1;
              this.availableCarPasses     = 1;
              this.availableHelperTickets = 1;
            }
            
            this.handleTicketAvailableChange('helper',  this.availableHelperTickets);
            this.handleTicketAvailableChange('carpass', this.availableCarPasses    );

            // force activate Helper Ticket
            if (this.availableTickets < 1 && this.availableHelperTickets > 0) {
              const ticketControl = this.ticketInfos.get('helper');
              ticketControl?.setValue(true);
              ticketControl?.disable();
            }
            
            this.isLoading = false;
          }),
          catchError((error) => {
            this.handleError('Fehler beim Verarbeiten der Counter und Limits. Kontaktiere uns bitte via Kontaktformular!');
            return throwError(error); // Rethrow the error to propagate it further
          })
        )
      )
    ).subscribe(); // Subscribe to trigger the observable chain
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

  submit(): void {
    this.submitLoading = true;
    this.statusMessage = '';

    // enable all controls to get all values
    Object.values(this.ticketInfos.controls).forEach((control) => control.enable());

    // add secret value
    if (this.isSecret) {
      if (this.ticketInfos.get('secret')) {
        this.ticketInfos.patchValue({
          secret: this.isSecret
        });
      } else {
        this.ticketInfos.addControl('secret', this.fb.control(this.isSecret));
      }
    }

    this.ticketService.writeTicket(this.ticketInfos.value as Ticket).subscribe(
      (data) => {
        this.submitLoading = false;
        this.statusMessage = data;
        
        this.ticketInfos.reset({
          name:                   '',
          surname:                '',
          email:                  '',
          phone:                  '',
          carpass:                false,
          carpassWish:            false,
          helper:                 false,
          helperWish:             false,
          helperShifts:           [],
          helperInfos:            '',
          agbsAccepted:           false,
          dataProtectionAccepted: false,
          over18:                 false
        });

        // todo: currently not working 
        // this.ticketInfos.markAsPristine();
        // this.ticketInfos.markAsUntouched();
        // Object.values(this.ticketInfos.controls).forEach((control) => {
        //   control.markAsPristine();
        //   control.markAsUntouched();
        // });

      },
      (error) => {
        this.submitLoading = false;
        this.statusMessage = 'Fehler beim Schreiben des Tickets: ' + error;
      }
    );
  }

  get ticketPrice(): number {
    return this.ticketInfos.get('helper')!.value && this.ticketInfos.get('carpass')!.value
      ? this.activeTicketLevel!.helper_with_carpass
      : this.ticketInfos.get('helper')!.value && !this.ticketInfos.get('carpass')!.value
      ? this.activeTicketLevel!.helper_price
      : !this.ticketInfos.get('helper')!.value && this.ticketInfos.get('carpass')!.value
      ? this.activeTicketLevel!.regular_with_carpass
      : this.activeTicketLevel!.regular_price;
  }

  formatPrice(price: number): string {
    if (price % 1 === 0) {
      return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0});
    }
    return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR'});
  }

  handleError(message: string, error?: any): Observable<never> {
    this.isLoading = false;
    this.error = true;
    this.errorMessage = error ? `${message}: ${error.message || error}` : message;

    return throwError(error);
  }

  getError(controlName: string, errorType: string): boolean {
    const control = this.ticketInfos.get(controlName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }


  // temporary 
  routeToTicketEdit(ticket: Ticket) {
    this.router.navigate(['/ticket/', ticket.id]);
  }
}