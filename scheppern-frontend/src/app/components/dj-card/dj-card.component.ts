import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dj-card',
  templateUrl: './dj-card.component.html',
  styleUrls: ['./dj-card.component.css']
})
export class DjCardComponent {
  @Input() dj: any;

}
