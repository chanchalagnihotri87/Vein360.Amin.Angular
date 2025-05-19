import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ContainerAllotmentComponent } from './container-allotment/container-allotment.component';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DonationComponent } from './donation/donation.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: DonationComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'container',
    component: ContainerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'container-allotment',
    component: ContainerAllotmentComponent,
    canActivate: [authGuard],
  },
];
