import { NgModule, Renderer2 } from '@angular/core';
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
import { GaleryComponent } from './views/galery/galery.component';
import { ScrollObserverDirective } from './directives/scroll-observer.directive';
import { WidthObserverDirective } from './directives/width-observer.directive';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';  
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    TicketEditComponent,
    ScrollObserverDirective,
    GaleryComponent,
    WidthObserverDirective,
    InfoCardComponent,
    FooterComponent
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
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSliderModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }