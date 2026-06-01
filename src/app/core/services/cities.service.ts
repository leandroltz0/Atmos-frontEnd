import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CityItem {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  lat: number;
  lon: number;
}

interface CitiesResponse {
  cities: CityItem[];
}

export interface CitySearchState {
  cities: CityItem[];
  loading: boolean;
  error: boolean;
}

const INITIAL_STATE: CitySearchState = {
  cities: [],
  loading: false,
  error: false
};

@Injectable({ providedIn: 'root' })
export class CitiesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  search(query: string): Observable<CitySearchState> {
    const value = query.trim();

    if (!value || value.length < 2) {
      return of(INITIAL_STATE);
    }

    const params = new HttpParams().set('q', value);

    return this.http.get<CitiesResponse>(`${this.apiUrl}/cities/search`, { params }).pipe(
      map(response => ({
        cities: response.cities.slice(0, 8),
        loading: false,
        error: false
      })),
      catchError(() => of({ cities: [], loading: false, error: true })),
      startWith({ cities: [], loading: true, error: false })
    );
  }
}
