import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route:ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserRole().pipe(
    map((res:any) =>{
      const userRole = res?.role;
      const allowedRoles = route.data['roles'] as string[];

      if(allowedRoles.includes(userRole)){
        return true;
      }
      router.navigate(['/unauthorise'])
      return false;
    }),
    catchError((err) =>{
      console.error(err);
      return of(router.createUrlTree(['/login']))
    })
  );
};
