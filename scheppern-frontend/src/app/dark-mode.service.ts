import { Injectable } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkMode = false;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    // Initialize dark mode based on user preference or local storage, if applicable.
    // You can implement this logic here if needed.
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
