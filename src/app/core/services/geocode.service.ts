import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GeocodeResult {
  city: string;
  countryName: string;
  countryCode: string;
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  private readonly http = inject(HttpClient);

  reverse(lat: number, lon: number): Observable<GeocodeResult> {
    return this.http.get<GeocodeResult>(BASE_URL, {
      params: {
        latitude: lat.toString(),
        longitude: lon.toString(),
        localityLanguage: 'es'
      }
    });
  }
}
