import { HttpInterceptorFn } from '@angular/common/http';

export const apiLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
