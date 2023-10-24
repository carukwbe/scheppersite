
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ticket } from 'src/models';
import { initializeApp } from 'firebase/app';
import { Functions, HttpsCallable, connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  private functions: any;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder
    ) { }

  form!: FormGroup;


  // tickets = this.firestore.collection<Ticket>('ticket-orders').valueChanges();
  
  ngOnInit(): void {
    const app = initializeApp(environment["firebase"]);
    this.functions = getFunctions(app);
    const useEmulator = true;

    if(useEmulator) {
      connectFunctionsEmulator(this.functions, "localhost", 5001);
    }

    this.form = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      phone: [''],
      payed: [false],
      ticket_sent: [false],
      price: [10, {disabled: true}],
      created: [new Date()]
    });
  }

  addTicket() {
    let inputData = this.form.value;
    console.log(inputData);

    const test_function = httpsCallable<{ input: string }, { output: string }>(this.functions, 'my_callable_function');
    test_function(inputData)
      .then((result) => {
        console.log(result.data); // Handle the response from the Callable function
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  addTicket_old() {
    //get ticket data from form

    const ticket: Ticket = {
      name: this.form.value.name,
      surname: this.form.value.surname,
      email: this.form.value.email,
      phone: this.form.value.phone,
      payed: this.form.value.payed,
      ticket_sent: this.form.value.ticket_sent,
      price: this.form.value.price,
      created: this.form.value.created
    };

    console.log(ticket);
    
    this.firestore.collection('ticket-orders').add(ticket)
      .then((docRef) => {
        console.log('Datensatz erfolgreich hinzugefügt mit ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Datensatzes: ', error);
      });
  }
}
