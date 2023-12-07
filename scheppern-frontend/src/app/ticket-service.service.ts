import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, HttpsCallableResult, getFunctions, Functions, httpsCallable } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore, Firestore, collection, onSnapshot, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { Ticket, TicketLevel } from 'src/models';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


interface Level {
  ticket_levels: TicketLevel[];
}


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

  // getAvailableTickets(): Observable<number> {
  //   // return this.http.get<number>(this.functionUrl);
  //   const ticketCountTrigger = httpsCallable(this.functions, 'ticketCount');

  // }

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

  getTicketLevels(): Observable<TicketLevel[][]> {
    const ticketLevelsCollection = collection(this.firestore, 'general_info');

    return new Observable((observer) => {
      onSnapshot(ticketLevelsCollection, (querySnapshot) => {
        const ticketLevels = querySnapshot.docs.map((doc) => {
          const ticketLevelData = doc.data() as Level;
          console.log(ticketLevelData.ticket_levels);
          return ticketLevelData.ticket_levels;
        });
        observer.next(ticketLevels);
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

  writeTicket(ticket: Ticket): Observable<string> {
    const writeTicketTrigger = httpsCallable<Ticket, string>(this.functions, 'writeTicket');

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
}
