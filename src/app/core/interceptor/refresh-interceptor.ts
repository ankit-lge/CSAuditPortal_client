import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  private isRreshing = false
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private route = inject(Router);
  private authService = inject(AuthService);
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse) => {
        if(error.status == 401 && !request.url.includes("/login") && !request.url.includes("/refresh-token")){
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    if(!this.isRreshing){
      this.isRreshing = true;
      this.refreshTokenSubject.next(null);

      return this.http.post(`${this.baseUrl}auth/refresh-token`, {}, {
        withCredentials:true
      }).pipe(
        switchMap(() =>{
          this.isRreshing = false;
          this.refreshTokenSubject.next(true);
          
          return next.handle(request);
        }),
        catchError((refreshError) =>{
          this.isRreshing = false;
          this.authService.logOut().subscribe();
          console.error('Session expired completely. Redirecting to login...', refreshError);
          this.route.navigate(['/landing']);
          return throwError(() => refreshError);
        })
      )
    }
    else{
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(request))
      )
    }
  }
}
