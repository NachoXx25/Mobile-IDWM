import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth } from '../_interfaces/auth';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  private currentAuthSource = new BehaviorSubject<Auth | null>(null);
  currentAuth$ = this.currentAuthSource.asObservable();
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
        if(auth){
          this.setCurrentAuth(auth);
          if (this.getRole() == 'Admin'){
            this.logout();
            console.log('Usuario no autorizado');
          }
        }
        return auth; // Devuelve la respuesta del login
      })
    );
  }

  register(model:any){
    return this.http.post<Auth>(this.baseUrl + '/auth/register', model).pipe(
      map((auth: Auth) => {
        if(auth){
          this.setCurrentAuth(auth);
        }
      })
    )
  }

  getCurrentAuth(): Auth | null {
    const auth = localStorage.getItem('auth');
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }
  setCurrentAuth(auth: Auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
    this.currentAuthSource.next(auth);
  }

  logout() {
    localStorage.removeItem('auth');
    this.currentAuthSource.next(null);
  }

  getClaimsOfToken(): any {
    const auth = this.getCurrentAuth();
    if (auth) {
      const token = auth.token;
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const claims = JSON.parse(decodedPayload);
      return claims;
    }
    return null;
  }

  getRole(): string {
    const claims = this.getClaimsOfToken();
    if (claims) {
      const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      return claims[roleKey] || '';
    }
    return '';
  }
}


