import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, HttpsCallableResult, getFunctions, Functions, httpsCallable } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore, Firestore, collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { Ticket, TicketLevel } from 'src/models';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Observer, from, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private firestore: Firestore;
  private functions: Functions;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  public authTokenSubject = new BehaviorSubject<string | null>(null);
  public authToken = this.authTokenSubject.asObservable();

  constructor() {
    const app = initializeApp(environment["firebase"]);
    this.functions = getFunctions(app, "europe-west3");
    this.firestore = getFirestore(app);

    if (environment.useEmulators) {
      connectFunctionsEmulator(this.functions, "localhost", 5001);
      connectFirestoreEmulator(this.firestore, environment.emulatorHost, environment.emulatorPort);
    }
  }

  // gets the entire collection
  getFirestoreCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(collectionRef,
        (querySnapshot) => {
          const documents: any[] = [];
          querySnapshot.forEach((doc) => {
            documents.push({
              id: doc.id,
              ...doc.data() as DocumentData
            });
          });
          observer.next(documents);
        },
        (error) => {
          observer.error(error);
        }
      );

      // Unsubscribe from the snapshot listener when the observable is unsubscribed
      return () => unsubscribe();
    });
  }

  // gets ticket levels from collection, processes date format 
  getTicketLevels(): Observable<any> {
    const levelsCollection = collection(this.firestore, 'price_levels');

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(levelsCollection, (querySnapshot) => {
        const levels = querySnapshot.docs.map(
          (doc) => {
            const levelData = doc.data() as TicketLevel;

            const dateFrom = levelData.active_from.toDate();
            const dateUntil = levelData.active_until.toDate();
            const now = new Date();

            levelData.active = dateFrom <= now && dateUntil >= now;
            levelData.future = dateFrom > now;
            
            // prepare date strings from firebase timestamp
            levelData.active_from_string  =  dateFrom.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
            levelData.active_until_string = dateUntil.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
            
            return levelData;
          });
          observer.next(levels);
        },
        (error) => {
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }

  getSingleTicket(ticketID: string): Observable<Ticket> {
    const infoTrigger = httpsCallable(this.functions, 'get_ticket');

    return new Observable((observer) => {
      infoTrigger(ticketID)
        .then((result: any) => {
          const ticket = result.data;
          ticket.id = ticketID;
          observer.next(ticket);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // creates or updates ticket
  writeTicket(ticket: Ticket, update: boolean = false): Observable<string> {
    const writeTicketTrigger = httpsCallable(this.functions, update ? 'edit_ticket' : 'create_ticket');

    return new Observable((observer) => {
      writeTicketTrigger(ticket)
        .then((result: any) => {
            observer.next(result.data);
        })
        .catch((error) => {
            observer.error(error);
        });
    });
  }

  sendMessage(message: string): Observable<string> {
    const sendMessageTrigger = httpsCallable(this.functions, 'save_message_from_contact_form');

    return new Observable((observer) => {
      sendMessageTrigger(message)
        .then((result: any) => {
          observer.next(result.data);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // scan, validate or delete ticket
  processTicket(ticketID: string, action: string): Observable<any> {
    const processTicketTrigger = httpsCallable<any, string>(this.functions, action);

    return new Observable((observer) => {
      processTicketTrigger(ticketID)
        .then((result: HttpsCallableResult<string>) => {
          observer.next(result.data);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // isAuthenticated(): Observable<boolean> {
  //   return this.isAuthenticatedSubject.asObservable();
  // }

  login(user: string, password: string): Observable<any> {
    const loginTrigger = httpsCallable(this.functions, 'admin_login');
    return new Observable((observer) => {
      loginTrigger({ 'username': user, 'password': password })
        .then((result: any) => {
          const authToken = result.data;
          this.saveAuthToken(authToken);
          this.isAuthenticatedSubject.next(true);
          observer.next(result.data);
        })
    });
  }

  private saveAuthToken(token: string): void {
    // Save the token to a secure storage (localStorage, sessionStorage, etc.)
    // You may want to implement additional security measures, like encryption.
    // For simplicity, I'm using sessionStorage here.
    sessionStorage.setItem('authToken', token);

    // Update the authTokenSubject
    this.authTokenSubject.next(token);
  }

  sendHeaders(route: string): void {
    const logHeaderTrigger = httpsCallable(this.functions, 'log_headers');
  
    const headersData = {
      'route': route,
      'width': window.innerWidth,
      'height': window.innerHeight
    };
  
    from(logHeaderTrigger(headersData)).subscribe({
      complete: () => {},
      error: (error) => console.error(error)
    });
  }
  
  // debug
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
}
