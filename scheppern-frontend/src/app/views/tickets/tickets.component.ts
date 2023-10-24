
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/models';
import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  private functions: any;
  isLoading = false;
  statusMessage = '';

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
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      hogwarts_house: ['', Validators.required],
    });
  }

  addTicket() {
    this.isLoading = true;
    let inputData = this.form.value;
    // console.log(inputData);

    const test_function = httpsCallable<{ input: string }, { output: string }>(this.functions, 'createOrUpdateTicket');
    test_function(inputData)
      .then((result) => {
        this.isLoading = false;
        console.log(result.data);
        this.statusMessage = "scheint geklappt zu haben";
        // this.statusMessage = result.data; 
      })
      .catch((error) => {
        this.isLoading = false;
        this.statusMessage = error.data;
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
      hogwarts_house: this.form.value.hogwarts_house,
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
