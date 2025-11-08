import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  userName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'blog_auth_token';
  private userKey = 'blog_auth_user';
  private _token$ = new BehaviorSubject<string | null>(localStorage.getItem(this.tokenKey));

  constructor(private http: HttpClient) {}

  get token$(): Observable<string | null> { return this._token$.asObservable(); }

  get token(): string | null { return this._token$.value; }

  login(url: string, username: string, password: string) {
    return this.http.post<any>(url, { userName: username, password: password }).pipe(
      tap(res => {
        // backend responses vary; try common token fields
        const token = res?.token ?? res?.accessToken ?? res?.jwt ?? res?.data?.token ?? res?.body?.token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem("userId", res.userId);
          this._token$.next(token);
        } else {
          // if no token returned, clear any existing one
          localStorage.removeItem(this.tokenKey);
          this._token$.next(null);
        }

        // user can be under different keys
        const user = res?.user ?? res?.userName ?? res?.data?.user ?? res?.body?.user ?? null;
        if (user) {
          localStorage.setItem(this.userKey, user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._token$.next(null);
  }

  getUser() {
    const raw = {'email':localStorage.getItem(this.userKey),'id':localStorage.getItem('userId')};
    return raw ;
  }
}
