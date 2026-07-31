import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route:ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let userRole = "";
  authService.getUserRole().subscribe({
    next : (res:any) =>{
      userRole = res?.roleGuard
    },
    error : (err) =>{
      console.error(err);
    }
  });
  const allowedRoles = route.data['roles'] as string[];

  if(allowedRoles.includes(userRole)){
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
