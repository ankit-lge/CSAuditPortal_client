import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const roleGuard: CanActivateFn = async (route:ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  try{
    const userRole = await authService.getUserRole();
     const allowedRoles = route.data['roles'] as string[];

      if(allowedRoles.includes(userRole)){
        return true;
      }
      router.navigate(['/unauthorise'])
      return false;
  }
  catch{
    return router.navigate(['/unauthorise'])
  }
};
