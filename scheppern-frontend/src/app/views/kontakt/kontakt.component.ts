import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TicketService } from 'src/app/ticket-service.service';

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
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      phone: [''],
      ticketID: [''],
      message: ['']
    });
  }

  submit() {
    this.isLoading = true;
    this.form.disable();

    this.ticketService.sendMessage(this.form.value).subscribe(
      (result) => {
        this.isLoading = false;
        this.statusMessage = "Ticket erfolgreich gespeichert.";
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
      }
    );
  }
}
