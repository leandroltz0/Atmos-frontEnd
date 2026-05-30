import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';
import { BackgroundStarfieldComponent } from '../../components/onboarding/background-starfield/background-starfield.component';
import { GlobeSceneComponent } from '../../components/onboarding/globe-scene/globe-scene.component';
import { ContentPanelComponent } from '../../components/onboarding/content-panel/content-panel.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [BackgroundStarfieldComponent, GlobeSceneComponent, ContentPanelComponent],
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.scss'
})
export class OnboardingPage {
  constructor(private readonly router: Router) {}

  protected onGetStarted(): void {
    localStorage.setItem('atmos.onboardingDone', 'true');
    void this.router.navigate([`/${APP_ROUTE_PATHS.allowLocation}`]);
  }
}
