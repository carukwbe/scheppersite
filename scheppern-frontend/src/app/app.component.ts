import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;


  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    // document.documentElement.style.cursor = "none";

    // Set the default theme when the component is initialized
    // toggleDarkMode(this.renderer, this.elementRef, true);
  }


  ngAfterViewInit() {
    this.scrollContainer!.nativeElement.addEventListener('scroll', (event: any) => {
      let scroll = this.scrollContainer!.nativeElement.scrollTop / this.scrollContainer!.nativeElement.clientHeight;

      this.scrollContainer!.nativeElement.style.setProperty('--scroll', scroll);
      this.elementRef.nativeElement.style.setProperty('--scroll', scroll);
      this.renderer.setStyle(document.documentElement, '--scroll', scroll);

      console.log(scroll);
      
    });
  }




  // cursor stuff

  // @HostListener('document:mousemove', ['$event'])
  // onMousemove($event: any) {
  //   this.top = ($event.pageY - 29) + "px";
  //   this.left = ($event.pageX - 19) + "px";
  // }
}