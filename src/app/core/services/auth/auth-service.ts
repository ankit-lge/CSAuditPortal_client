import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInKey = 'i_l_i' // is Logged in 
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  setLoginStatus(status:boolean){
    localStorage.setItem(this.loggedInKey, status ? 'true': 'false');
  }

  isLoggedIn(): boolean{
    return localStorage.getItem(this.loggedInKey) === 'true';
  }

  getUserRole(){
    return this.http.get(`${this.baseUrl}Auth/me`)
  }

  authorise(userId:string, authToken: string){
    return this.http.post(`${this.baseUrl}auth/login`, {
      username : userId,
      password : authToken
    })
  }
  logOut(){
    localStorage.removeItem(this.loggedInKey);
    return this.http.post(`${this.baseUrl}Auth/logout`,{})
  }
}
