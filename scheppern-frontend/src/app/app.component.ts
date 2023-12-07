import { Component, ElementRef } from '@angular/core';
import { ScrollService } from './scroll.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHomePage: boolean = false;


  constructor(private router: Router) {
    // document.documentElement.style.cursor = "none";
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/';
      }
    });
  }







  // cursor stuff

  // @HostListener('document:mousemove', ['$event'])
  // onMousemove($event: any) {
  //   this.top = ($event.pageY - 29) + "px";
  //   this.left = ($event.pageX - 19) + "px";
  // }
}