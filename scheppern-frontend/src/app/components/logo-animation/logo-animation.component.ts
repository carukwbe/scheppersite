import { Component } from '@angular/core';

@Component({
  selector: 'app-logo-animation',
  templateUrl: './logo-animation.component.html',
  styleUrls: ['./logo-animation.component.css']
})
export class LogoAnimationComponent {
  bezier_fast = {
    scroll: { start: 2.5, end: 4.5 },
    mapTo: { start: 3, end: 0 },
    bezier: [0.7, 0, 0.3, 1]
  }
}
