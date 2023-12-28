import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHomePage: boolean = false;


  // constructor(private router: Router, private activatedRoute: ActivatedRoute) {  }

  constructor(private router: Router) {
    // document.documentElement.style.cursor = "none";

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
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