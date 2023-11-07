import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appWidthObserver]'
})
export class WidthObserverDirective {
  constructor(private el: ElementRef) { }

  @Input() appWidthObserver?: {
    scroll: { start: number, end: number },
    mapTo: { start: number, end: number },
    bezier: number[] // https://cubic-bezier.com/
  } = {
    scroll: { start: 0, end: 1 },
    mapTo: { start: 0, end: 1 },
    bezier: [1, 1, 0, 0]
  };

  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onResize(event: Event) {
    const htmlElement = document.documentElement;

    //calculate Percentage of a client to be desktop
    // 0% -> mobile
    // 100% -> desktop
    const mobileMinWidth = 420;
    const desktopMaxWidth = 1440;
    const gesamt = desktopMaxWidth - mobileMinWidth;
    const clientMobilePercentage = (htmlElement.clientWidth - mobileMinWidth) / gesamt;

    const properties = {
      '--clientWidth': htmlElement.clientWidth,
      '--clientHeight': htmlElement.clientHeight,
      '--clientMobilePercentage': clientMobilePercentage
    };

    for (const [property, value] of Object.entries(properties)) {
      this.el.nativeElement.style.setProperty(property, value);
    }
  }
}
