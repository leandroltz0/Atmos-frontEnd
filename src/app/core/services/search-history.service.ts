import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { SearchHistoryEntry } from '../models/favorite.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = environment.apiBaseUrl;

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<SearchHistoryEntry[]> {
    return this.http
      .get<{ history: SearchHistoryEntry[] }>(`${this.baseUrl}/search-history`, {
        headers: this.getHeaders()
      })
      .pipe(map((res) => res.history));
  }

  create(city: { name: string; country?: string; lat?: number; lon?: number }): Observable<SearchHistoryEntry> {
    return this.http
      .post<{ entry: SearchHistoryEntry }>(`${this.baseUrl}/search-history`, city, {
        headers: this.getHeaders()
      })
      .pipe(map((res) => res.entry));
  }

  clear(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/search-history`, {
      headers: this.getHeaders()
    });
  }
}
