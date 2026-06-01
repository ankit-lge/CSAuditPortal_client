import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiLoaderService } from '../services/apiLoader/api-loader-service';
import { finalize, Observable } from 'rxjs';

@Injectable() export class apiLoaderInterceptor implements HttpInterceptor {
  constructor(
    private loader: ApiLoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.loader.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.loader.hide();
      })
    );
  }
};
