import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public title = 'scheppern-frontend';

  bild: string = 'media/leon.jpg'



  top: any;
  left: any;
  expand = false;




  // @HostListener('document:click', ['$event'])
  // onClick($event:any) {
  //   this.expand = true;
  //   setTimeout(() => {
  //     this.expand = false;
  //   }, 500)
  // }


}
