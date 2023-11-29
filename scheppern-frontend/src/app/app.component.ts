import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ScrollService } from './scroll.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;
  isHomePage: boolean = false;


  constructor(private elementRef: ElementRef, private scrollService: ScrollService, private router: Router) {
    // document.documentElement.style.cursor = "none";
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/';
      }
    });
  }


  ngAfterViewInit() {
    this.scrollContainer!.nativeElement.addEventListener('scroll', (event: any) => {
      
      // update shared scroll service
      let scroll = this.scrollContainer!.nativeElement.scrollTop / this.scrollContainer!.nativeElement.clientHeight;
      this.scrollService.updateScroll(scroll);

      // update css variable on root element -> deprecated use scrollModifier
      this.elementRef.nativeElement.style.setProperty('--scroll', scroll);
    });
  }




  // cursor stuff

  // @HostListener('document:mousemove', ['$event'])
  // onMousemove($event: any) {
  //   this.top = ($event.pageY - 29) + "px";
  //   this.left = ($event.pageX - 19) + "px";
  // }
}