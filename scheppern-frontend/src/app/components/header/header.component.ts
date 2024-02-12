import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideInFromTop', [
      state('void', style({ height: '0', opacity: '-0.5', paddingTop: '0', paddingBottom: '0'})),
      state('*', style({ height: '*', opacity: '1', paddingTop: '*', paddingBottom: '*'})),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class HeaderComponent {
  // isHomePage: boolean = false;
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
