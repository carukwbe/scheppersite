import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideInFromTop', [
      state('void', style({ height: '0', opacity: '-0.5' })),
      state('*', style({ height: '*', opacity: '1' })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class HeaderComponent {
  // isHomePage: boolean = false;
  isMenuOpen: boolean = false;

  // constructor(private router: Router) {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       this.isHomePage = event.url === '/';
  //     }
  //   });
  // }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
