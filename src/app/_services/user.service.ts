import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Purchase } from '../_interfaces/purchase';
import { Observable } from 'rxjs';
import { Auth } from '../_interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPurchasesByUser(userId: number): Observable<Purchase[]> {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}') as Auth;
    const token = auth?.token;
    console.log("Aqui se imprime el token:"+token)

    if (!token) {
      throw new Error('Token no encontrado en el localStorage');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Llamando a la API para obtener las compras del usuario...');
    return this.http.get<Purchase[]>(`${this.baseUrl}/user/${userId}/purchases`, { headers });
  }
}
