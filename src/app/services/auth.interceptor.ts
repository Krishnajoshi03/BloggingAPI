import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;
    let headers = req.headers;
    
    console.log('[AuthInterceptor] Intercepting request', { url: req.url, hasToken: !!token });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('[AuthInterceptor] Added Authorization header');
    } else {
      console.log('[AuthInterceptor] No token available');
    }
    
    const cloned = req.clone({ headers });
    return next.handle(cloned).pipe(
      catchError((err: any) => {
        console.log('[AuthInterceptor] Error caught', { status: err?.status, url: req.url });
        if (err instanceof HttpErrorResponse && err.status === 401) {
          console.log('[AuthInterceptor] 401 Unauthorized - logging out');
          // Token expired or invalid - logout and redirect to login
          this.auth.logout();
          this.router.navigate(['/login'], { 
            queryParams: { 
              returnUrl: this.router.url,
              expired: 'true'
            } 
          });
        }
        return throwError(() => err);
      })
    );
  }
}
