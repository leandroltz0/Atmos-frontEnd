import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  DestroyRef,
  inject,
  signal,
  viewChild,
  ElementRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { gsap } from 'gsap';

import { APP_ROUTE_PATHS } from '../../../core/routing/app-route-paths';

@Component({
  selector: 'app-quick-nav',
  standalone: true,
  imports: [MatRippleModule],
  template: `
    <nav #navRef class="db-quick-nav" aria-label="Navegación principal">
      <button
        class="db-nav-btn"
        [class.active]="isActive(APP_ROUTE_PATHS.dashboard)"
        (click)="goToHome()"
        matRipple
        aria-label="Inicio"
        id="nav-home"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3L21 12" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
          <path d="M5 10V20H19V10" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
          <path d="M10 20V14H14V20" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
        </svg>
        <span>Inicio</span>
      </button>

      <button
        class="db-nav-btn"
        [class.active]="isActive(APP_ROUTE_PATHS.favorites)"
        (click)="goToFavorites()"
        matRipple
        aria-label="Favoritos"
        id="nav-favorites"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"
          />
        </svg>
        <span>Favoritos</span>
      </button>

      <button
        class="db-nav-btn"
        [class.active]="isActive(APP_ROUTE_PATHS.search)"
        (click)="goToSearch()"
        matRipple
        aria-label="Buscar"
        id="nav-search"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
        <span>Buscar</span>
      </button>

      <button
        class="db-nav-btn"
        [class.active]="isActive(APP_ROUTE_PATHS.profile)"
        (click)="goToProfile()"
        matRipple
        aria-label="Perfil"
        id="nav-profile"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7"/>
          <path d="M4 20C4 17 7.58 14.5 12 14.5C16.42 14.5 20 17 20 20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
        <span>Perfil</span>
      </button>

      <button
        class="db-nav-btn"
        [class.active]="isActive(APP_ROUTE_PATHS.settings)"
        (click)="goToSettings()"
        matRipple
        aria-label="Ajustes"
        id="nav-settings"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="1.7"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke="currentColor" stroke-width="1.7"/>
        </svg>
        <span>Ajustes</span>
      </button>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickNavComponent implements AfterViewInit, OnDestroy {
  protected readonly APP_ROUTE_PATHS = APP_ROUTE_PATHS;

  private readonly navRef = viewChild<ElementRef<HTMLElement>>('navRef');
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly activeRoute = signal(this.router.url);
  private mm?: gsap.MatchMedia;

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((e) => {
      this.activeRoute.set(e.urlAfterRedirects);
    });
  }

  ngAfterViewInit(): void {
    const navEl = this.navRef()?.nativeElement;
    if (!navEl) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const btns = navEl.querySelectorAll<HTMLButtonElement>('.db-nav-btn');

      btns.forEach((btn) => {
        const icon = btn.querySelector('svg');
        const span = btn.querySelector('span');

        btn.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            y: -3,
            scale: 1.18,
            duration: 0.35,
            ease: 'back.out(1.7)',
            overwrite: 'auto'
          });
          gsap.to(span, {
            opacity: 0.95,
            duration: 0.2,
            overwrite: 'auto'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto'
          });
          gsap.to(span, {
            opacity: 0.6,
            duration: 0.2,
            overwrite: 'auto'
          });
        });
      });

      return () => {
        btns.forEach((btn) => {
          const icon = btn.querySelector('svg');
          const span = btn.querySelector('span');
          gsap.set(icon, { y: 0, scale: 1, clearProps: 'all' });
          gsap.set(span, { opacity: '', clearProps: 'all' });
        });
      };
    });

    this.mm = mm;
  }

  ngOnDestroy(): void {
    this.mm?.revert();
  }

  protected isActive(routePath: string): boolean {
    return this.activeRoute().startsWith(`/${routePath}`);
  }

  protected goToHome(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.dashboard}`]);
  }

  protected goToFavorites(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.favorites}`]);
  }

  protected goToSearch(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.search}`]);
  }

  protected goToProfile(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.profile}`]);
  }

  protected goToSettings(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.settings}`]);
  }
}
