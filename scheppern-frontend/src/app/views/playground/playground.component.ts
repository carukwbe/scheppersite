import { Component, OnInit } from '@angular/core';
// import { gsap } from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';


@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  scrollProgress: number = 0;


  constructor() {
  }

  ngOnInit(): void {
    // gsap.registerPlugin(ScrollTrigger);

    // const el = document.querySelector(".container") as HTMLElement;

    // ScrollTrigger.create({
    //   trigger: document.querySelector("body"),
    //   start: "top top",
    //   end: "bottom bottom",
    //   onUpdate: (self: any) => {
    //     this.scrollProgress = self.progress;
    //     el.style.setProperty("--scroll-progress", this.scrollProgress.toString());
    //   }
    // });
  }
}
