import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { AccentColorService } from 'src/app/services/accent-color.service';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  animations: [
    trigger('slideInFromTop', [
      state('void', style({ opacity: '0' , transform: 'translateY(20px)'})),
      state('*', style({ opacity: '1' , transform: 'translateY(0)'})),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class SliderComponent {
  constructor(private accentColorService: AccentColorService) { }
  color = this.accentColorService.accentColor1;

  @Output() closeSliderEvent = new EventEmitter<void>();

  onSliderMouseDown(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
  }

  notScrolling(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    event.preventDefault();
  } 

  slide() {
    this.accentColorService.updateAccentColor({
      red: this.color.red,
      green: this.color.green,
      blue: this.color.blue,
      alpha: this.color.alpha
    });
  }

}
