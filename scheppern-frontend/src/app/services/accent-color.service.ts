import { Injectable } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccentColorService {
  private darkMode = false;

  accentColor1 = {
    red: 30,
    green: 124,
    blue: 172,
    alpha: 10
  };

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    const initialAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color1');

    // Parse the RGBA values from the CSS color string
    const match = initialAccentColor.match(/rgba?\((\d+), (\d+), (\d+), ([\d.]+)\)/);
    
    if (match) {
      const [, red, green, blue, alpha] = match.map(parseFloat);

      this.accentColor1 = {
        red,
        green,
        blue,
        alpha: alpha * 100,
      };
    }
  }

  // Toggle dark mode and update the global state
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.updateDarkModeClasses();
  }

  // Set dark mode based on a specific value
  setDarkMode(darkMode: boolean) {
    this.darkMode = darkMode;
    this.updateDarkModeClasses();
  }

  // Check if dark mode is enabled
  isDarkMode() {
    return this.darkMode;
  }

  updateAccentColor(color: { red: number, green: number, blue: number, alpha: number }) {
    this.accentColor1 = color;
    const alpha = color.alpha / 100;

    document.documentElement.style.setProperty('--accent-color1', `rgba(${color.red}, ${color.green}, ${color.blue}, ${alpha})`);
    //calculate the luminance of the background color
    const luminance = (0.299 * color.red + 0.587 * color.green + 0.114 * color.blue) / 255;
    this.setDarkMode(luminance < 0.5 || alpha < 0.7);
  }
  
  private updateDarkModeClasses() {
    const rootElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (this.darkMode) {
      this.renderer.addClass(rootElement, 'dark-mode');
      this.renderer.removeClass(rootElement, 'light-mode');
    } else {
      this.renderer.addClass(rootElement, 'light-mode');
      this.renderer.removeClass(rootElement, 'dark-mode');
    }
  }
}
