import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/services/ticket-service.service';
import { emailValidators, phoneValidators, textValidators, ticketIDValidators } from 'src/app/validators';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.css']
})
export class KontaktComponent {
  form!: FormGroup;
  isLoading = false;
  statusMessage = '';

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService
  ) { 
    this.ticketService.sendHeaders('kontact');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', emailValidators],
      phone: ['', phoneValidators],
      ticketID: ['', ticketIDValidators],
      message:  ['', [Validators.required, ...textValidators]]
    });
  }

  getError(controlName: string, errorType: string): boolean {
    const control = this.form.get(controlName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }

  submit() {
    this.isLoading = true;
    this.form.disable();

    this.ticketService.sendMessage(this.form.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.statusMessage = result;
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
      }
    );
  }
}
