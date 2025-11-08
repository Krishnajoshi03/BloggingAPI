import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueryService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // convenience login wrapper that uses AuthService
  login(url: string, username: string, password: string): Observable<any> {
    console.debug('[QueryService] login', { url });
    return this.auth.login(url, username, password);
  }

  runPostQuery(url: string, body: any, params?: any) {
    console.debug('[QueryService] POST', { url, params, body });
    return this.http.post(url, body, { params: params });
  }

  runPutQuery(url: string, body: any, params?: any) {
    console.debug('[QueryService] PUT', { url, params, body });
    return this.http.put(url, body, { params: params });
  }

  runDeleteQuery(url: string, params?: any) {
    console.debug('[QueryService] DELETE', { url, params });
    return this.http.delete(url, { params: params });
  }

  runGetQuery(url: string, params?: any) {
    console.debug('[QueryService] GET', { url, params });
    return this.http.get(url, { params: params });
  }
}
