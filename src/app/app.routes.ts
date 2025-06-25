import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContainerAllotmentComponent } from './container-allotment/container-allotment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DonationComponent } from './donation/donation.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', component: DonationComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'container',
    component: ContainerAllotmentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'product',
    component: ProductComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'user/:id',
    component: EditUserComponent,
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
];
