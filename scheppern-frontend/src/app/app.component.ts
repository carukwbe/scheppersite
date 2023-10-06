import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scheppern-frontend';

  testCollectionRef: any;
  test$: any;

  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.testCollectionRef = this.afs.collection('ticket-orders');
    this.test$ = this.testCollectionRef.valueChanges();


    console.log(this.testCollectionRef);

    this.test$.subscribe((data: any) => {
      console.log(data);
    });

  
  
  }
}