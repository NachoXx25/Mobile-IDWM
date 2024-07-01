import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth } from '../_interfaces/auth';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl; // URL base de la API
  private currentAuthSource = new BehaviorSubject<Auth | null>(null); // Fuente de datos para la autenticación actual
  currentAuth$ = this.currentAuthSource.asObservable(); // Observable para la autenticación actual
  constructor(private http: HttpClient) { } // Inyecta el servicio de HttpClient

  getToken(): string | null {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authObj: Auth = JSON.parse(auth);
      return authObj.token;
    }
    return null;
  }
  /**
   *  Login de usuario
   * @param model  Datos del usuario
   * @returns  Respuesta del login
   */
  login(model: any) {
    return this.http.post<Auth>(this.baseUrl + '/auth/login', model).pipe(
      map((auth: Auth) => {
        if(auth){
          this.setCurrentAuth(auth);
        }
        return auth; // Devuelve la respuesta del login
      })
    );
  }
  /**
   *  Registro de usuario
   * @param model  Datos del usuario
   * @returns  Respuesta del registro
   */
  register(model:any){
    return this.http.post<Auth>(this.baseUrl + '/auth/register', model).pipe(
      map((auth: Auth) => {
        if(auth){
          this.setCurrentAuth(auth);
        }
      })
    )
  }
  /**
   *  Obtiene la autenticación actual
   * @returns Autenticación actual
   */
  getCurrentAuth(): Auth | null {
    const auth = localStorage.getItem('auth');
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }
  /**
   *  Establece la autenticación actual
   * @param auth Autenticación actual
   */
  setCurrentAuth(auth: Auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
    this.currentAuthSource.next(auth);
  }
  /**
   * Cierra la sesión del usuario
   */
  logout() {
    localStorage.removeItem('auth');
    this.currentAuthSource.next(null);
  }
  /**
   *  Obtiene los claims del token
   * @returns Claims del token
   */
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
  /**
   *  Obtiene el role del usuario
   * @returns Role del usuario
   */
  getRole(): string {
    const claims = this.getClaimsOfToken();
    if (claims) {
      const roleKey =  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      return claims[roleKey] || '';
    }
    return '';
  }
  /**
   *  Verifica si el usuario está autenticado
   * @returns  Si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const auth = this.getCurrentAuth();
    return auth !== null;
  }
}


