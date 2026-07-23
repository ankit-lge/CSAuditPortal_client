import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInKey = 'i_l_i' // is Logged in 
  

  setLoginStatus(status:boolean){
    localStorage.setItem(this.loggedInKey, status ? 'true': 'false');
  }

  isLoggedIn(): boolean{
    return localStorage.getItem(this.loggedInKey) === 'true';
  }

  logOut():void{
    localStorage.removeItem(this.loggedInKey);
  }
}
