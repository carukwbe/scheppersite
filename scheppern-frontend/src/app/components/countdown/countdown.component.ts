import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  targetDate: Date = new Date('2024-02-29T12:00:00'); // Set your target date and time
  timeRemaining: any;

  constructor() { }

  ngOnInit(): void {
    // Calculate the initial time remaining
    this.calculateTimeRemaining();

    // Update the time remaining every second
    setInterval(() => {
      this.calculateTimeRemaining();
    }, 1000);
  }

  calculateTimeRemaining() {
    const now = new Date();
    const difference = Math.max(this.targetDate.getTime() - now.getTime(), 0);
  
    this.timeRemaining = difference > 0 ? {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    } : null;
  }
}
