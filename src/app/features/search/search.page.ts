import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
  effect,
  afterNextRender,
  ElementRef
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { gsap } from 'gsap';

import { MatInputModule } from '@angular/material/input';

import { Router } from '@angular/router';

import { EMPTY, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';

import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';
import { CitiesService, CityItem, CitySearchState } from '../../core/services/cities.service';

type SearchStatus = 'initial' | 'writing' | 'loading' | 'results' | 'no-results' | 'error' | 'offline';

interface RecentSearch {
  id: string;
  label: string;
}

const RECENT_STORAGE_KEY = 'atmos.search.recent';
const FAVORITE_STORAGE_KEY = 'atmos.search.favorites';
const RECENT_LIMIT = 10;

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ],
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage implements OnInit, OnDestroy {
  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly status = signal<SearchStatus>('initial');
  protected readonly results = signal<CityItem[]>([]);
  protected readonly recent = signal<RecentSearch[]>([]);
  protected readonly favorites = signal<string[]>([]);
  protected readonly isOffline = signal(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  protected readonly hasQuery = computed(() => this.queryControl.value.trim().length > 0);
  protected readonly query = computed(() => this.queryControl.value.trim());

  protected readonly title = 'Buscar ciudad';
  protected readonly subtitle = 'Encontra el clima de cualquier lugar en segundos.';

  private searchSubscription?: Subscription;
  private retrySubscription?: Subscription;
  private readonly citiesService = inject(CitiesService);
  private readonly router = inject(Router);
  private readonly el = inject(ElementRef);

  private readonly handleOnline = () => {
    this.isOffline.set(false);
    if (this.query().length >= 2) {
      this.status.set('writing');
    } else {
      this.status.set('initial');
    }
  };

  private readonly handleOffline = () => {
    this.isOffline.set(true);
    this.status.set('offline');
  };

  constructor() {
    afterNextRender(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo(this.el.nativeElement.querySelector('.search-header'),
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
        .fromTo(this.el.nativeElement.querySelector('.search-input-wrap'),
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.05')
        .fromTo(this.el.nativeElement.querySelectorAll('.recent-section'),
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=1.0')
        .fromTo(this.el.nativeElement.querySelectorAll('.recent-chip'),
        { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.04 }, '-=0.8');
    });

    effect(() => {
      const currentStatus = this.status();
      const currentResults = this.results();

      setTimeout(() => {
        if (!this.el?.nativeElement) return;

        if (currentStatus === 'results') {
          gsap.fromTo(this.el.nativeElement.querySelectorAll('.result-item'),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.05, clearProps: 'all' }
          );
        } else if (currentStatus === 'loading') {
          gsap.fromTo(this.el.nativeElement.querySelectorAll('.skeleton-item'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05, clearProps: 'all' }
          );
        } else if (currentStatus === 'initial') {
           gsap.fromTo(this.el.nativeElement.querySelectorAll('.recent-chip, .empty-state'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.04, clearProps: 'all' }
          );
        } else if (currentStatus === 'no-results' || currentStatus === 'error' || currentStatus === 'offline') {
           gsap.fromTo(this.el.nativeElement.querySelector('.empty-state'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', clearProps: 'all' }
          );
        }
      }, 20);
    });
  }

  ngOnInit(): void {
    this.recent.set(this.readRecent());
    this.favorites.set(this.readFavorites());

    this.bindNetworkEvents();

    this.searchSubscription = this.queryControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(rawValue => this.handleQuery(rawValue))
      )
      .subscribe((state: CitySearchState) => {
        this.results.set(state.cities);

        if (state.loading) {
          this.status.set('loading');
        } else if (state.error) {
          this.status.set('error');
        } else {
          this.status.set(state.cities.length > 0 ? 'results' : 'no-results');
        }
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.retrySubscription?.unsubscribe();

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }

  protected clearQuery(): void {
    this.queryControl.setValue('');
    this.results.set([]);
    this.status.set(this.isOffline() ? 'offline' : 'initial');
  }

  protected selectRecent(item: RecentSearch): void {
    this.queryControl.setValue(item.label);
  }

  protected clearRecent(): void {
    this.recent.set([]);
    localStorage.removeItem(RECENT_STORAGE_KEY);
  }

  protected selectCity(city: CityItem): void {
    this.addRecent(city);
    this.router.navigate([`/${APP_ROUTE_PATHS.dashboard}`], {
      queryParams: {
        city: city.name,
        country: city.countryCode,
        lat: city.lat,
        lon: city.lon
      }
    });
  }

  protected toggleFavorite(city: CityItem, event: Event): void {
    event.stopPropagation();

    const current = this.favorites();
    const exists = current.includes(city.id);
    const next = exists ? current.filter(id => id !== city.id) : [...current, city.id];
    this.favorites.set(next);
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(next));
  }

  protected isFavorite(city: CityItem): boolean {
    return this.favorites().includes(city.id);
  }

  protected cityLabel(city: CityItem): string {
    return city.region
      ? `${city.name}, ${city.region}, ${city.country}`
      : `${city.name}, ${city.country}`;
  }

  protected retrySearch(): void {
    this.retrySubscription?.unsubscribe();
    this.retrySubscription = this.handleQuery(this.queryControl.value)
      .pipe(take(1))
      .subscribe((state: CitySearchState) => {
        this.results.set(state.cities);

        if (state.loading) {
          this.status.set('loading');
        } else if (state.error) {
          this.status.set('error');
        } else {
          this.status.set(state.cities.length > 0 ? 'results' : 'no-results');
        }
      });
  }

  private handleQuery(rawValue: string): Observable<CitySearchState> {
    const value = rawValue.trim();

    if (this.isOffline()) {
      this.status.set('offline');
      this.results.set([]);
      return EMPTY;
    }

    if (!value) {
      this.status.set('initial');
      this.results.set([]);
      return EMPTY;
    }

    if (value.length < 2) {
      this.status.set('writing');
      this.results.set([]);
      return EMPTY;
    }

    if (value.toLowerCase() === 'error') {
      this.status.set('error');
      this.results.set([]);
      return EMPTY;
    }

    return this.citiesService.search(value);
  }

  private addRecent(city: CityItem): void {
    const nextItem: RecentSearch = {
      id: city.id,
      label: this.cityLabel(city)
    };

    const deduped = this.recent().filter(item => item.id !== city.id);
    const next = [nextItem, ...deduped].slice(0, RECENT_LIMIT);
    this.recent.set(next);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
  }

  private readRecent(): RecentSearch[] {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as RecentSearch[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.slice(0, RECENT_LIMIT);
    } catch {
      return [];
    }
  }

  private readFavorites(): string[] {
    const raw = localStorage.getItem(FAVORITE_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private bindNetworkEvents(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.isOffline.set(!navigator.onLine);

    if (this.isOffline()) {
      this.status.set('offline');
    }

    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }
}
