import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'allow-location',
    loadComponent: () => import('./pages/allow-location/allow-location.page').then((m) => m.AllowLocationPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then((m) => m.OnboardingPage)
  }
];
