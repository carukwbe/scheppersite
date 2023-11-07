import { Component, ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scheppern-frontend';

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    // document.documentElement.style.cursor = "none";

    // Set the default theme when the component is initialized
    // toggleDarkMode(this.renderer, this.elementRef, true);
  }







  // cursor stuff

  // @HostListener('document:mousemove', ['$event'])
  // onMousemove($event: any) {
  //   this.top = ($event.pageY - 29) + "px";
  //   this.left = ($event.pageX - 19) + "px";
  // }
}