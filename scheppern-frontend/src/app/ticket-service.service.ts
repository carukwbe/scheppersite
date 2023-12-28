import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, HttpsCallableResult, getFunctions, Functions, httpsCallable } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore, Firestore, collection, onSnapshot, doc, getDoc, DocumentSnapshot, getDocs } from 'firebase/firestore';
import { Ticket, TicketLevel } from 'src/models';
import { environment } from '../environments/environment';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private firestore: Firestore;
  private functions: Functions;

  constructor() {
    const app = initializeApp(environment["firebase"]);
    this.functions = getFunctions(app, "europe-west3");
    this.firestore = getFirestore(app);

    if (environment.useEmulators) {
      connectFunctionsEmulator(this.functions, "localhost", 5001);
      connectFirestoreEmulator(this.firestore, environment.emulatorHost, environment.emulatorPort);
    }
  }

  getAvailableTickets(): Observable<number> {
    const ticketCountTrigger = httpsCallable(this.functions, 'tickets_available');

    return new Observable((observer) => {
      // Trigger the Cloud Function
      ticketCountTrigger()
        .then((result) => {
          const initialCount = result.data as number;
          observer.next(initialCount);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getTicketInfo(): Observable<TicketLevel[]> {
    const infoTrigger = httpsCallable(this.functions, 'get_ticket_levels');

    return new Observable((observer) => {
      infoTrigger()
        .then((result: any) => {
          const parsedData = { ticket_levels: JSON.parse(result.data.ticket_levels) };
          observer.next(parsedData.ticket_levels);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // // with a collection
  // getTicketInfo(): Observable<any> {
  //   const infoCollection = collection(this.firestore, 'price_levels');

  //   return new Observable((observer) => {
  //     onSnapshot(infoCollection, (querySnapshot) => {
  //       const info = querySnapshot.docs.map((doc) => {
  //         const infoData = doc.data() as TicketLevel;

  //         // prepare date string from firebase timestamp
  //         const date = infoData.activation_date.toDate();
  //         infoData.activation_date_string = date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  //         return infoData;
  //       });
  //       observer.next(info);
  //     });
  //   });
  // }


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
            ticketData.id = docSnap.id;
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

  writeTicket(ticket: Ticket): Observable<string> {
    const writeTicketTrigger = httpsCallable<Ticket, string>(this.functions, 'write_ticket');

    return new Observable((observer) => {
      writeTicketTrigger(ticket)
        .then((result: HttpsCallableResult<string>) => {
          observer.next(result.data);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  validateTicket(ticketID: string): Observable<any> {
    const writeTicketTrigger = httpsCallable<any, string>(this.functions, 'validate_ticket');

    return new Observable((observer) => {
      writeTicketTrigger(ticketID)
        .then((result: HttpsCallableResult<string>) => {
          observer.next(result.data);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
