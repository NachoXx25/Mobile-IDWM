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

  getToken(): string | null {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authObj: Auth = JSON.parse(auth);
      return authObj.token;
    }
    return null;
  }

  login(model: any) {
    return this.http.post<Auth>(this.baseUrl + '/auth/login', model).pipe(
      map((auth: Auth) => {
        console.log('Respuesta del login:', auth); // Aquí se imprime la respuesta del login
        if (auth) {
          localStorage.setItem('auth', JSON.stringify(auth));
        }
        return auth; // Devuelve la respuesta del login
      })
    );
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


