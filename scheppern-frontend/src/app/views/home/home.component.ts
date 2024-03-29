import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HomePageService } from 'src/app/services/homepage.service';
import { TicketService } from 'src/app/services/ticket-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;

  constructor(
    private ticketService: TicketService,
    private homePageService: HomePageService
  ) {
    this.ticketService.sendHeaders('home');
  }

  ngOnInit() {
    this.homePageService.isHomePage = true;
  }



  // scroll variable stuff
  // constructor(private scrollService: ScrollService ) { }
  // ngAfterViewInit() {
  //   this.scrollContainer!.nativeElement.addEventListener('scroll', (event: any) => {

  //     // update shared scroll service
  //     let scroll = this.scrollContainer!.nativeElement.scrollTop / this.scrollContainer!.nativeElement.clientHeight;
  //     this.scrollService.updateScroll(scroll);
  //   });
  // }


}
