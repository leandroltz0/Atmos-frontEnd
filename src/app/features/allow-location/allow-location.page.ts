import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';
import { BackgroundStarfieldComponent } from '../../components/allow-location/background-starfield/background-starfield.component';
import { GlobeSceneComponent } from '../../components/allow-location/globe-scene/globe-scene.component';
import { ParticlesComponent } from '../../components/allow-location/particles/particles.component';
import { LocationPanelComponent } from '../../components/allow-location/location-panel/location-panel.component';

const HOME_NAVIGATION_DELAY_MS = 1200;

@Component({
  selector: 'app-allow-location',
  standalone: true,
  imports: [
    BackgroundStarfieldComponent,
    GlobeSceneComponent,
    ParticlesComponent,
    LocationPanelComponent
  ],
  templateUrl: './allow-location.page.html',
  styleUrl: './allow-location.page.scss'
})
export class AllowLocationPage implements AfterViewInit, OnDestroy {
  @ViewChild('rootRef')
  private readonly rootRef!: ElementRef<HTMLDivElement>;

  @ViewChild(GlobeSceneComponent)
  private readonly globeScene!: GlobeSceneComponent;

  @ViewChild(LocationPanelComponent)
  private readonly locationPanel!: LocationPanelComponent;

  protected isLocationGranted = false;
  private entryTimeline?: gsap.core.Timeline;

  constructor(
    private readonly ngZone: NgZone,
    private readonly router: Router
  ) {}

  ngAfterViewInit(): void {
    this.playEntryAnimation();
  }

  ngOnDestroy(): void {
    this.entryTimeline?.kill();
    gsap.killTweensOf(this.rootRef.nativeElement);
  }

  protected onAllowLocation(): void {
    if (this.isLocationGranted) return;

    this.isLocationGranted = true;
    localStorage.setItem('atmos.locationDone', 'true');
    this.locationPanel.allowBtn.nativeElement.classList.add('allow-btn--granted');
    this.playGrantedButtonAnimation();

    if (!navigator.geolocation) {
      this.navigateAuthAfterDelay();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem('atmos_lat', position.coords.latitude.toString());
        localStorage.setItem('atmos_lon', position.coords.longitude.toString());
        this.navigateAuthAfterDelay();
      },
      () => this.navigateAuthAfterDelay()
    );
  }

  protected onSkip(): void {
    localStorage.setItem('atmos.locationDone', 'true');
    gsap.to(this.rootRef.nativeElement, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => void this.navigateAuth()
    });
  }

  private navigateAuthAfterDelay(): void {
    window.setTimeout(() => void this.navigateAuth(), HOME_NAVIGATION_DELAY_MS);
  }

  private navigateAuth(): Promise<boolean> {
    return this.ngZone.run(() => this.router.navigate([`/${APP_ROUTE_PATHS.auth}`]));
  }

  private playGrantedButtonAnimation(): void {
    gsap.timeline()
      .to(this.locationPanel.allowBtn.nativeElement, { scale: 0.96, duration: 0.08, ease: 'power1.in' })
      .to(this.locationPanel.allowBtn.nativeElement, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  }

  private playEntryAnimation(): void {
    const contentElements = [
      this.locationPanel.headline.nativeElement,
      this.locationPanel.description.nativeElement,
      this.locationPanel.allowBtn.nativeElement,
      this.locationPanel.skipLink.nativeElement
    ];

    gsap.set(contentElements, { opacity: 0, y: 24 });
    gsap.set(this.globeScene.globeWrap.nativeElement, { opacity: 0, scale: 0.85 });
    gsap.set(this.globeScene.pinDot.nativeElement, { scale: 0, opacity: 0 });

    this.entryTimeline = gsap.timeline({ delay: 0.3 });

    this.entryTimeline.to(this.globeScene.globeWrap.nativeElement, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: 'back.out(1.4)'
    });

    this.entryTimeline.to(this.globeScene.pinDot.nativeElement, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(2)'
    }, '-=0.4');

    this.entryTimeline.to(this.locationPanel.headline.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.2');

    this.entryTimeline.to(this.locationPanel.description.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');

    this.entryTimeline.to(this.locationPanel.allowBtn.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');

    this.entryTimeline.to(this.locationPanel.skipLink.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2');

    this.entryTimeline.add(() => {
      gsap.to(this.globeScene.globeWrap.nativeElement, {
        y: -10,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
  }
}
