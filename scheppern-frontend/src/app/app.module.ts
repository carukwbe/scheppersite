import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './views/home/home.component';
import { DjCardComponent } from './components/dj-card/dj-card.component';
import { TicketComponent } from './views/ticket/ticket.component';
import { InfosComponent } from './views/infos/infos.component';
import { KontaktComponent } from './views/kontakt/kontakt.component';
import { ImpressumComponent } from './views/impressum/impressum.component';
import { HeaderComponent } from './components/header/header.component';
import { TicketEditComponent } from './views/ticket-edit/ticket-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DjCardComponent,
    TicketComponent,
    InfosComponent,
    KontaktComponent,
    ImpressumComponent,
    HeaderComponent,
    TicketEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }