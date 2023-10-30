import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';
import * as bezierEasing from 'bezier-easing';

@Directive({
  selector: '[appScrollObserver]'
})
export class ScrollObserverDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @Input() appScrollObserver: {
    scroll: { start: number, end: number },
    mapTo: { start: number, end: number },
    bezier: number[] // https://cubic-bezier.com/
  } =  {
    scroll: { start: 0, end: 1},
    mapTo: { start: 0, end: 1},
    bezier: [1, 1, 0, 0]
  };

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onScroll(event: Event) {
    if (
      this.appScrollObserver.scroll.start === this.appScrollObserver.scroll.end || 
      this.appScrollObserver.bezier.length != 4
    ) return;

    const htmlElement = document.documentElement;

    // scroll is 1 if one screen height is scrolled
    let scroll = htmlElement.scrollTop / htmlElement.clientHeight;
    scroll = Math.round(scroll * 1000) / 1000; // maybe not necessary

    // cap scroll to start and end
    scroll = Math.min(this.appScrollObserver.scroll.end, scroll);
    scroll = Math.max(this.appScrollObserver.scroll.start, scroll);

    // map input to (0,1)
    scroll = scroll / (this.appScrollObserver.scroll.end - this.appScrollObserver.scroll.start);

    // map to bezierfunction
    const bezierFunction = bezierEasing(
      this.appScrollObserver.bezier[0], this.appScrollObserver.bezier[1],
      this.appScrollObserver.bezier[2], this.appScrollObserver.bezier[3]
    );
    scroll = bezierFunction(scroll);

    scroll = scroll * (this.appScrollObserver.mapTo.end - this.appScrollObserver.mapTo.start) + this.appScrollObserver.mapTo.start;

    //calculate Percentage of a client to be desktop
    // 0% -> mobile
    // 100% -> desktop
    const mobileMinWidth = 320;
    const desktopMaxWidth = 1440;
    const gesamt = desktopMaxWidth - mobileMinWidth;
    const clientMobilePercentage = (htmlElement.clientWidth - mobileMinWidth) / gesamt;

    console.log(clientMobilePercentage);
    const properties = {
      '--scroll': scroll,
      '--scrollNegated': 1 - scroll,
      '--clientWidth': htmlElement.clientWidth,
      '--clientHeight': htmlElement.clientHeight,
      '--clientMobilePercentage': clientMobilePercentage,
    };
    
    for (const [property, value] of Object.entries(properties)) {
      this.el.nativeElement.style.setProperty(property, value);
    }
  }
}