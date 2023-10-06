import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { AngularFirestore } from 'angularfire2/firestore';


import { environment } from '../environments/environment';

// import { AngularFireModule } from "@angular/fire/compat";
// import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
// import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
// import { provideFirestore,getFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideFirestore(() => getFirestore()),
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }