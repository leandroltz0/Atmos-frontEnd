import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTE_PATHS } from '../routing/app-route-paths';

const ONBOARDING_KEY = 'atmos.onboardingDone';
const LOCATION_KEY = 'atmos.locationDone';

export const onboardingRequiredGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  if (!localStorage.getItem(ONBOARDING_KEY)) {
    void router.navigate([`/${APP_ROUTE_PATHS.onboarding}`]);
    return false;
  }

  return true;
};

export const onboardingRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    void router.navigate([`/${APP_ROUTE_PATHS.favorites}`]);
    return false;
  }

  const onboardingDone = localStorage.getItem(ONBOARDING_KEY);
  const locationDone = localStorage.getItem(LOCATION_KEY);

  if (onboardingDone) {
    if (locationDone) {
      void router.navigate([`/${APP_ROUTE_PATHS.auth}`]);
    } else {
      void router.navigate([`/${APP_ROUTE_PATHS.allowLocation}`]);
    }
    return false;
  }

  return true;
};
