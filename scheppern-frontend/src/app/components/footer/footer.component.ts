import { Component } from '@angular/core';
import { AccentColorService } from 'src/app/services/accent-color.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [AccentColorService]
})
export class FooterComponent {
  sliderHidden: boolean = true;

  toggleSlider(): any {
    setTimeout(() => {
      this.sliderHidden = !this.sliderHidden;
    });
  }
}
