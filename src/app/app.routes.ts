import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from './core/routing/app-route-paths';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import {
  onboardingRequiredGuard,
  onboardingRedirectGuard
} from './core/guards/onboarding.guard';
import { locationRequiredGuard } from './core/guards/location.guard';
import { ShellComponent } from './shared/components/shell/shell.component';

export const routes: Routes = [
  // ── Onboarding flow (no navbar, guestGuard for authenticated redirect) ──
  {
    path: APP_ROUTE_PATHS.onboarding,
    canActivate: [guestGuard, onboardingRedirectGuard],
    loadComponent: () => import('./features/onboarding/onboarding.page').then((m) => m.OnboardingPage)
  },
  {
    path: APP_ROUTE_PATHS.allowLocation,
    canActivate: [guestGuard, onboardingRequiredGuard],
    loadComponent: () => import('./features/allow-location/allow-location.page').then((m) => m.AllowLocationPage)
  },
  {
    path: APP_ROUTE_PATHS.auth,
    canActivate: [guestGuard, onboardingRequiredGuard, locationRequiredGuard],
    loadComponent: () => import('./features/auth/auth.page').then((m) => m.AuthPage)
  },

  // ── Authenticated shell (navbar always visible) ──
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: APP_ROUTE_PATHS.settings,
        loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage)
      },
      {
        path: APP_ROUTE_PATHS.favorites,
        loadComponent: () => import('./features/favorites/favorites.page').then((m) => m.FavoritesPage)
      },
      {
        path: APP_ROUTE_PATHS.detail,
        loadComponent: () => import('./features/detail/detail.page').then((m) => m.DetailPage)
      },
      {
        path: APP_ROUTE_PATHS.home,
        redirectTo: APP_ROUTE_PATHS.dashboard,
        pathMatch: 'full'
      },
      {
        path: APP_ROUTE_PATHS.dashboard,
        loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage)
      },
      {
        path: APP_ROUTE_PATHS.search,
        loadComponent: () => import('./features/search/search.page').then((m) => m.SearchPage)
      },
      {
        path: APP_ROUTE_PATHS.profile,
        loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_ROUTE_PATHS.favorites
      }
    ]
  },

  // ── Fallback ──
  {
    path: '**',
    redirectTo: APP_ROUTE_PATHS.onboarding
  }
];
