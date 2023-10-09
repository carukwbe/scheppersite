import { Component, HostListener } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scheppern-frontend';

  top: any;
  left: any;
  constructor() {
    document.documentElement.style.cursor = "none";
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove($event: any) {
    this.top = ($event.pageY - 29) + "px";
    this.left = ($event.pageX - 19) + "px";
  }
}