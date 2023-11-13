import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DarkModeService } from './../../dark-mode.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DarkModeService]
})
export class HomeComponent {

  constructor( private darkModeService: DarkModeService ) { }

  bezier_fast = {
    scroll: { start: 0.3, end: 2.5 },
    mapTo: { start: 0, end: 15 },
    bezier: [1,1,0,0]
  }


  red = 0;
  green = 55;
  blue = 109;
  
  updateBackgroundColor() {
    const backgroundColor = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.setProperty('--bg-color', `rgb(${this.red}, ${this.green}, ${this.blue})`);

    //calculate the luminance of the background color
    const luminance = (0.299 * this.red + 0.587 * this.green + 0.114 * this.blue) / 255;
    // toggleDarkMode(this.renderer, this.elementRef, luminance < 0.5);
    this.darkModeService.setDarkMode(luminance < 0.5);
  }


  ngOnInit(): void {
    // this.updateBackgroundColor();
  }

  // cursor stuff

  // @HostListener('document:click', ['$event'])
  // onClick($event:any) {
  //   this.expand = true;
  //   setTimeout(() => {
  //     this.expand = false; 
  //   }, 500)
  // }


}
