import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';
import { capToRange, mapStartRangeToEndRange, mapToBezier } from '../utils';

@Directive({
  selector: '[appScrollObserver]'
})
export class ScrollObserverDirective {
  constructor(private el: ElementRef) { }

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
    ) { console.error("appSrollObserver got invalid values"); return; }
    const htmlElement = document.documentElement;

    // scroll is 1 if one screen height is scrolled
    let scroll = htmlElement.scrollTop / htmlElement.clientHeight;
    scroll = Math.round(scroll * 1000) / 1000; // maybe not necessary
    
    // map input range to (0,1) for Bezier Function
    scroll = mapStartRangeToEndRange(
      scroll, 
      [this.appScrollObserver.scroll.start, this.appScrollObserver.scroll.end], 
      [0, 1]
    );

    scroll = capToRange(scroll, 0, 1); // cap it to (0,1)
    scroll = mapToBezier(scroll, this.appScrollObserver.bezier);
    
    // map to output Range
    scroll = mapStartRangeToEndRange(
      scroll, 
      [0, 1],
      [this.appScrollObserver.mapTo.start, this.appScrollObserver.mapTo.end]
    );

    // set css variable on element
    this.el.nativeElement.style.setProperty('--scroll', scroll);
  }
}