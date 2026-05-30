import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTE_PATHS } from '../routing/app-route-paths';

const LOCATION_KEY = 'atmos.locationDone';

export const locationRequiredGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  if (!localStorage.getItem(LOCATION_KEY)) {
    void router.navigate([`/${APP_ROUTE_PATHS.allowLocation}`]);
    return false;
  }

  return true;
};
