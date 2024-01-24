import { Component, Host, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHomePage: boolean = false;

  top: string = "";
  left: string = "";
  expand: boolean = false;
  tilt = false;

  constructor(private router: Router) {
    // document.documentElement.style.cursor = "none";

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
      }
    });
  }



  // cursor stuff

  @HostListener('document:mousemove', ['$event'])
  onMousemove($event: any) {
    this.top = ($event.pageY - 29) + "px";
    this.left = ($event.pageX - 19) + "px";
  }

  // onclick expand

  @HostListener('document:click', ['$event'])
  onClick($event:any) {
    this.expand = true;
    setTimeout(() => {
      this.expand = false; 
    }, 500)
  }

  //hover over clickable
 @HostListener('document:mouseover', ['$event'])
  onMouseover($event: any) {
    if ($event.target.classList.contains("clickable")) {
      this.tilt = true;
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseout($event: any) {
    if ($event.target.classList.contains("clickable")) {
      this.tilt = false;
    }
  }

  // cursor stuff end 
}