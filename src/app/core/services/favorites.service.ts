import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AddFavoriteRequest, FavoriteCity, ReorderFavoritesRequest } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = 'http://localhost:5008';

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<FavoriteCity[]> {
    return this.http
      .get<{ favorites: FavoriteCity[] }>(`${this.baseUrl}/favorites`, {
        headers: this.getHeaders()
      })
      .pipe(map((res) => res.favorites));
  }

  create(city: AddFavoriteRequest): Observable<FavoriteCity> {
    return this.http
      .post<{ favorite: FavoriteCity }>(`${this.baseUrl}/favorites`, city, {
        headers: this.getHeaders()
      })
      .pipe(map((res) => res.favorite));
  }

  remove(cityId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/favorites/${cityId}`, {
      headers: this.getHeaders()
    });
  }

  reorder(favoriteIds: string[]): Observable<FavoriteCity[]> {
    const body: ReorderFavoritesRequest = { favoriteIds };
    return this.http
      .patch<{ favorites: FavoriteCity[] }>(`${this.baseUrl}/favorites/reorder`, body, {
        headers: this.getHeaders()
      })
      .pipe(map((res) => res.favorites));
  }
}
