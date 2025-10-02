import { Routes } from '@angular/router';
import { DashboardComponent } from '../../../features/dashboard/dashboard.component';
import { ReservationsListComponent } from '../../../features/reservations/reservations-list/reservations-list.component';
import { ReservationFormComponent } from '../../../features/reservations/reservation-form/reservation-form.component';
import { BusinessListComponent } from '../../../features/business/business-list/business-list.component';
import { BusinessFormComponent } from '../../../features/business/business-form/business-form.component';

export const layoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reservations', component: ReservationsListComponent },
  { path: 'reservations/new', component: ReservationFormComponent },
  { path: 'reservations/edit/:id', component: ReservationFormComponent },
  { path: 'business', component: BusinessListComponent },
  { path: 'business/new', component: BusinessFormComponent },
  { path: 'business/edit/:id', component: BusinessFormComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
