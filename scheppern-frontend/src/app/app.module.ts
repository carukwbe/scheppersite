import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';

import {CdkDrag} from '@angular/cdk/drag-drop';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './views/home/home.component';
import { TicketFormComponent } from './views/ticket-form/ticket-form.component';
import { InfosComponent } from './views/infos/infos.component';
import { KontaktComponent } from './views/kontakt/kontakt.component';
import { ImpressumComponent } from './views/impressum/impressum.component';
import { TicketEditComponent } from './views/ticket-edit/ticket-edit.component';
import { HelperComponent } from './views/helper/helper.component';
import { TicketScanComponent } from './views/ticket-scan/ticket-scan.component';
import { SiteNotFoundComponent } from './views/site-not-found/site-not-found.component';
import { TicketValidateComponent } from './views/ticket-validate/ticket-validate.component';
import { AgbsComponent } from './views/agbs/agbs.component';
import { TicketsClosedComponent } from './views/tickets-closed/tickets-closed.component';

import { ParallaxComponent } from './parallax/parallax.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoAnimationComponent } from './components/logo-animation/logo-animation.component';

import { WidthObserverDirective } from './directives/width-observer.directive';
import { ScrollModifierDirective } from './directives/scroll-modifier.directive';
import { FormatEuroPipe } from './format-euro.pipe';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SliderComponent } from './components/slider/slider.component';
import { DatenschutzComponent } from './views/datenschutz/datenschutz.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TicketFormComponent,
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
    AgbsComponent,
    TicketScanComponent,
    SiteNotFoundComponent,
    TicketsClosedComponent,
    FormatEuroPipe,
    LoginDialogComponent,
    SliderComponent,
    DatenschutzComponent,
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
    MatDialogModule,
    MatTableModule,
    CdkDrag
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }