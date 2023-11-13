import { Directive, HostListener, ElementRef, Renderer2, Input, ViewChild } from '@angular/core';
import { capToRange, mapStartRangeToEndRange, mapToBezier } from '../utils';



// not working because I moved the scroll context for the entire site from the window inside a div for parallax effect

@Directive({
  selector: '[appScrollObserver]'
})
export class ScrollObserverDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @Input() bezierFunction: {
    scroll: { start: number, end: number },
    mapTo: { start: number, end: number },
    bezier: number[] // https://cubic-bezier.com/
  } = {
    scroll: { start: 0, end: 1},
    mapTo: { start: 0, end: 1},
    bezier: [1, 1, 0, 0]
  };

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onScroll(event: Event) {
    if (
      this.bezierFunction.scroll.start === this.bezierFunction.scroll.end || 
      this.bezierFunction.bezier.length != 4
    ) { console.error("appSrollObserver got invalid values"); return; }
    const htmlElement = document.documentElement;
      


    // scroll is 1 if one screen height is scrolled
    let scroll = htmlElement.scrollTop / htmlElement.clientHeight;
    
    // map input range to (0,1) for Bezier Function
    scroll = mapStartRangeToEndRange(
      scroll, 
      [this.bezierFunction.scroll.start, this.bezierFunction.scroll.end], 
      [0, 1]
    );

    scroll = capToRange(scroll, 0, 1); // cap it to (0,1)
    scroll = mapToBezier(scroll, this.bezierFunction.bezier);
    

    // map to output Range
    scroll = mapStartRangeToEndRange(
      scroll, 
      [0, 1],
      [this.bezierFunction.mapTo.start, this.bezierFunction.mapTo.end]
    );

    // set css variable on element
    this.el.nativeElement.style.setProperty('--scroll', scroll);
  }
}