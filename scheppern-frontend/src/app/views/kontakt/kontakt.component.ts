import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.css']
})
export class KontaktComponent {
  form!: FormGroup;
  isLoading = false;
  statusMessage = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      ticketID: [''],
      message: ['']
    });
  }

  submit() {
    this.isLoading = true;
    this.form.disable();

    setTimeout(() => {
      this.isLoading = false;
      this.form.enable();
    }, 2000);
  }

}
