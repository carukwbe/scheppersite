import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TicketService } from './ticket-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private ticketService: TicketService,
  ) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(username: string, password: string): void {
    this.ticketService.login(username, password).subscribe(
      (data) => {
        console.log('Success:', data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}