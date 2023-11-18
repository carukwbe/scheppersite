import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// holds a shared scroll variable for the scrollModifiers to use

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollSubject = new Subject<number>();
  scroll$ = this.scrollSubject.asObservable();

  updateScroll(scroll: number) {
    this.scrollSubject.next(scroll);
  }
}