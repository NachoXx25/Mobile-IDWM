import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth } from '../_interfaces/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(model:any){
    return this.http.post<Auth>(this.baseUrl + '/auth/login', model).pipe(
      map((auth: Auth) => {
        if(auth){
          localStorage.setItem('user', JSON.stringify(auth.token));
        }
      })
    )
    }
}


