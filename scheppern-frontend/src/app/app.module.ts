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
import { TicketComponent } from './views/ticket/ticket.component';
import { InfosComponent } from './views/infos/infos.component';
import { KontaktComponent } from './views/kontakt/kontakt.component';
import { ImpressumComponent } from './views/impressum/impressum.component';
import { ParallaxComponent } from './parallax/parallax.component';
import { TicketEditComponent } from './views/ticket-edit/ticket-edit.component';
import { WidthObserverDirective } from './directives/width-observer.directive';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';  
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HeaderComponent } from './components/header/header.component';
import { HelperComponent } from './views/helper/helper.component';
import { LogoAnimationComponent } from './components/logo-animation/logo-animation.component';
import { ScrollModifierDirective } from './directives/scroll-modifier.directive';
import { MatStepperModule } from '@angular/material/stepper';
import { TicketValidateComponent } from './views/ticket-validate/ticket-validate.component';
import { HelperPopupComponent } from './components/helper-popup/helper-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AgbsComponent } from './views/agbs/agbs.component';
import { TicketScanComponent } from './views/ticket-scan/ticket-scan.component';
import { SiteNotFoundComponent } from './views/site-not-found/site-not-found.component';
import { MailComponent } from './views/mail/mail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TicketComponent,
    InfosComponent,
    KontaktComponent,
    ImpressumComponent,
    ParallaxComponent,
    TicketEditComponent,
    WidthObserverDirective,
    InfoCardComponent,
    FooterComponent,
    HeaderComponent,
    HelperComponent,
    LogoAnimationComponent,
    ScrollModifierDirective,
    TicketValidateComponent,
    HelperPopupComponent,
    AgbsComponent,
    TicketScanComponent,
    SiteNotFoundComponent,
    MailComponent
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
    MatCheckboxModule,
    MatStepperModule,
    MatDialogModule,
    MatTableModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }