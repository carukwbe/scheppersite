import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  bezier_fast = {
    scroll: { start: 0.3, end: 2.5 },
    mapTo: { start: 0, end: 10 },
    bezier: [1,1,0,0]
  }




  // @HostListener('document:click', ['$event'])
  // onClick($event:any) {
  //   this.expand = true;
  //   setTimeout(() => {
  //     this.expand = false;
  //   }, 500)
  // }


}
