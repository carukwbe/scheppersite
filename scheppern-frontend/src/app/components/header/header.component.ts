import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isHomePage: boolean = false;

  bezier_fast = {
    scroll: { start: 0, end: 1 },
    mapTo: { start: 0, end: 1 },
    bezier: [.26, 0.1, .3, .99]
  }

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/';
      }
    });
  }
}
