import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { TicketComponent } from './views/ticket/ticket.component';
import { ImpressumComponent } from './views/impressum/impressum.component';
import { InfosComponent } from './views/infos/infos.component';
import { TicketEditComponent } from './views/ticket-edit/ticket-edit.component';
import { HelperComponent } from './views/helper/helper.component';
import { KontaktComponent } from './views/kontakt/kontakt.component';
import { TicketValidateComponent } from './views/ticket-validate/ticket-validate.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tickets', component: TicketComponent },
  { path: 'ticket/:id', component: TicketEditComponent },
  { path: 'validate_ticket/:id', component: TicketValidateComponent },
  { path: 'infos', component: InfosComponent },
  { path: 'helfer', component: HelperComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'kontakt', component: KontaktComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
