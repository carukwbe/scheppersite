import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, HttpsCallableResult, getFunctions, Functions, httpsCallable } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore, Firestore, collection, onSnapshot, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { Ticket } from 'src/models';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private firestore: Firestore;
  private functions: Functions;

  constructor() {
    const app = initializeApp(environment["firebase"]);
    this.functions = getFunctions(app);
    this.firestore = getFirestore(app);

    if (environment.useEmulators) {
      connectFunctionsEmulator(this.functions, "localhost", 5001);
      connectFirestoreEmulator(this.firestore, environment.emulatorHost, environment.emulatorPort);
    }
  }

  getAllTickets(): Observable<Ticket[]> {
    const ticketsCollection = collection(this.firestore, 'tickets');

    return new Observable((observer) => {
      onSnapshot(ticketsCollection, (querySnapshot) => {
        const tickets = querySnapshot.docs.map((doc) => {
          const ticketData = doc.data() as Ticket;
          ticketData.id = doc.id;
          return ticketData;
        });
        observer.next(tickets);
      });
    });
  }

  getSingleTicket(docID: string): Observable<Ticket | null> {
    const docRef = doc(this.firestore, 'tickets', docID);

    return new Observable((observer) => {
      getDoc(docRef)
        .then((docSnap: DocumentSnapshot) => {
          if (docSnap.exists()) {
            const ticketData = docSnap.data() as Ticket;
            observer.next(ticketData);
          } else {
            observer.next(null);
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  createOrUpdateTicket(ticket: Ticket): Observable<string> {
    const createOrUpdateTicket = httpsCallable<Ticket, string>(this.functions, 'createOrUpdateTicket');

    return new Observable((observer) => {
      createOrUpdateTicket(ticket)
        .then((result: HttpsCallableResult<string>) => {
          observer.next(result.data);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
