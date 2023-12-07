import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;

  
  
  
  
  
  
  // scroll variable stuff
  // constructor(private scrollService: ScrollService ) { }
  // ngAfterViewInit() {
  //   this.scrollContainer!.nativeElement.addEventListener('scroll', (event: any) => {

  //     // update shared scroll service
  //     let scroll = this.scrollContainer!.nativeElement.scrollTop / this.scrollContainer!.nativeElement.clientHeight;
  //     this.scrollService.updateScroll(scroll);
  //   });
  // }



  // cursor stuff

  // @HostListener('document:click', ['$event'])
  // onClick($event:any) {
  //   this.expand = true;
  //   setTimeout(() => {
  //     this.expand = false; 
  //   }, 500)
  // }


}
