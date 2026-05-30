import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { PublicUser } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = 'http://localhost:5008';

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  updateName(name: string): Observable<PublicUser> {
    return this.http
      .patch<{ user: PublicUser }>(`${this.baseUrl}/users/me`, { name }, { headers: this.getHeaders() })
      .pipe(map((res) => res.user));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/users/me/password`,
      { currentPassword, newPassword },
      { headers: this.getHeaders() }
    );
  }

  deleteAccount(password: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me`, {
      headers: this.getHeaders(),
      body: { password }
    });
  }
}
