import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authApiUrl = `${environment.apiBaseUrl}/auth`;

  register(payload: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.authApiUrl}/register`, payload);
  }

  login(payload: LoginRequest): Observable<unknown> {
    return this.http.post(`${this.authApiUrl}/login`, payload);
  }
}
