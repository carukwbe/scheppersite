// scroll-modifier.directive.ts

import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { ScrollService } from '../scroll.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { capToRange, mapStartRangeToEndRange, mapToBezier } from '../utils';

@Directive({
  selector: '[appScrollModifier]',
})
export class ScrollModifierDirective implements OnInit {
  constructor(private el: ElementRef, private scrollService: ScrollService) { }

  private destroy$ = new Subject<void>();

  @Input() bezierFunction: {
    scroll: { start: number, end: number },
    mapTo: { start: number, end: number },
    bezier: number[] // https://cubic-bezier.com/
  } = {
    scroll: { start: 0, end: 1 },
    mapTo: { start: 0, end: 1 },
    bezier: [1, 1, 0, 0]
  };


  ngOnInit() {
    if ( 
      this.bezierFunction.scroll.start === this.bezierFunction.scroll.end ||
      this.bezierFunction.bezier.length != 4
    ) { console.error("appScrollModifier got invalid values"); return; }

    this.scrollService.scroll$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scroll) => {

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

        // todo: test this if it is smoother

        requestAnimationFrame(() => {
          this.el.nativeElement.style.setProperty('--scrollRange', scroll.toString());
        });

        // // test this aswell
        // const observer = new IntersectionObserver((entries) => {
        //   // Your logic to update scroll variable
        // }, { threshold: 0.1 }); // Adjust the threshold value as needed

      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
