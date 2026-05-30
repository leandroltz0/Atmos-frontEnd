import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { UserPreferences } from '../models/favorite.model';

const DEFAULT_PREFERENCES: UserPreferences = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  language: 'es',
  timeFormat: '24h',
  updateInterval: 30,
  pushNotifications: true,
  autoUpdate: true,
  offlineMode: false
};

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = 'http://localhost:5008';

  readonly preferences = signal<UserPreferences>(DEFAULT_PREFERENCES);

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  get(): Observable<UserPreferences> {
    return this.http
      .get<{ preferences: UserPreferences }>(`${this.baseUrl}/preferences`, {
        headers: this.getHeaders()
      })
      .pipe(
        map((res) => res.preferences),
        tap((prefs) => this.preferences.set(prefs))
      );
  }

  update(patch: Partial<UserPreferences>): Observable<UserPreferences> {
    return this.http
      .patch<{ preferences: UserPreferences }>(`${this.baseUrl}/preferences`, patch, {
        headers: this.getHeaders()
      })
      .pipe(
        map((res) => res.preferences),
        tap((prefs) => this.preferences.set(prefs))
      );
  }
}
