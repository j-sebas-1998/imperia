import { Routes } from '@angular/router';
import { AuthPage } from './auth/auth';
import { LandingPage } from './landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'auth',
    component: AuthPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
