import { Component } from '@angular/core';
import { DarkModeService } from 'src/app/dark-mode.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DarkModeService]
})
export class FooterComponent {

  red = 30;
  green = 124;
  blue = 172;
  alpha = 10;
  
  constructor(private darkModeService: DarkModeService) { }


  ngOnInit(): void {
    this.updateBackgroundColor();
  }

  updateBackgroundColor() {
    const alpha = this.alpha / 100;

    document.documentElement.style.setProperty('--accent-color1', `rgba(${this.red}, ${this.green}, ${this.blue}, ${alpha})`);
    //calculate the luminance of the background color
    const luminance = (0.299 * this.red + 0.587 * this.green + 0.114 * this.blue) / 255;
    this.darkModeService.setDarkMode(luminance < 0.5 || alpha < 0.7);
  }
}
