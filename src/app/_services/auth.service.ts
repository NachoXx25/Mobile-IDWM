import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth } from '../_interfaces/auth';
import { map } from 'rxjs';

import { UserLog } from '../_interfaces/UserLog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('user');
  }

  login(model:any){
    return this.http.post<Auth>(this.baseUrl + '/auth/login', model).pipe(
      map((auth: Auth) => {
        if(auth){
          const user = new UserLog(auth.user, auth.token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    )
  }

  register(model:any){
    return this.http.post<Auth>(this.baseUrl + '/auth/register', model).pipe(
      map((auth: Auth) => {
        if(auth){
          localStorage.setItem('user', JSON.stringify(auth.token));
        }
      })
    )
  }
}


