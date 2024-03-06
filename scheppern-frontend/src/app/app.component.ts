import { Component, Host, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HomePageService } from './services/homepage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHomePage: boolean = true;

  top: string = "";
  left: string = "";
  expand: boolean = false;
  tilt = false;



  constructor(private router: Router, public homePageService: HomePageService) {
    this.homePageService.isHomePage = false;

    // document.documentElement.style.cursor = "none";

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
        // this.isHomePage = event.urlAfterRedirects.startsWith('/');
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
