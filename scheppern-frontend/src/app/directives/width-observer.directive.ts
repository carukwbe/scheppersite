import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appWidthObserver]'
})
export class WidthObserverDirective {
  constructor(private el: ElementRef) { }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onResize(event: Event) {
    const htmlElement = document.documentElement;

    // calculate Percentage of a client to be desktop
    // 0% -> mobile
    // 100% -> desktop
    const mobileMinWidth = 320;
    const desktopMaxWidth = 1440;
    const gesamt = desktopMaxWidth - mobileMinWidth;
    const isDesktopPercentage = Math.min((htmlElement.clientWidth - mobileMinWidth) / gesamt,1);

    const properties = {
      '--clientWidth': htmlElement.clientWidth,
      '--clientHeight': htmlElement.clientHeight,
      '--widthHeightRatio': htmlElement.clientWidth / htmlElement.clientHeight,
      '--isDesktopPercentage': isDesktopPercentage,
      '--isMobilePercentage': 1 - isDesktopPercentage,
    };

    for (const [property, value] of Object.entries(properties)) {
      this.el.nativeElement.style.setProperty(property, value);
    }
  }
}
