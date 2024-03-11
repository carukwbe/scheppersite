import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { TicketFormComponent } from './views/ticket-form/ticket-form.component';
import { ImpressumComponent } from './views/impressum/impressum.component';
import { InfosComponent } from './views/infos/infos.component';
import { TicketEditComponent } from './views/ticket-edit/ticket-edit.component';
import { KontaktComponent } from './views/kontakt/kontakt.component';
import { TicketValidateComponent } from './views/ticket-validate/ticket-validate.component';
import { AgbsComponent } from './views/agbs/agbs.component';
import { TicketScanComponent } from './views/ticket-scan/ticket-scan.component';
import { SiteNotFoundComponent } from './views/site-not-found/site-not-found.component';
import { TicketsClosedComponent } from './views/tickets-closed/tickets-closed.component';
import { AuthGuard } from './auth.guard';
import { DatenschutzComponent } from './views/datenschutz/datenschutz.component';
import { GalerieComponent } from './views/galerie/galerie.component';

const routes: Routes = [
  { path: '',                    component: HomeComponent },
  { path: 'tickets',             component: TicketFormComponent },
  { path: 'supersecrettickets',  component: TicketFormComponent, canActivate: [AuthGuard], data: { roles: 'admin' }}, //todo: proper auth over backend with lazy loading
  { path: 'ticket/:id',          component: TicketEditComponent },
  { path: 'validate_ticket/:id', component: TicketValidateComponent },
  { path: 'scan_ticket/:id',     component: TicketScanComponent },
  { path: 'infos',               component: InfosComponent },
  { path: 'galerie',             component: GalerieComponent },
  { path: 'kontakt',             component: KontaktComponent },
  { path: 'impressum',           component: ImpressumComponent },
  { path: 'agbs',                component: AgbsComponent },
  { path: 'datenschutz',         component: DatenschutzComponent },
  { path: '404',                 component: SiteNotFoundComponent },
  { path: '**',                  redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
