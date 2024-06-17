import { Component, Input, OnInit } from '@angular/core';
import { PurchaseService } from 'src/app/_services/user.service';
import { Purchase } from 'src/app/_interfaces/purchase';
import { Observable } from 'rxjs';
import { IonContent, IonGrid, IonRow, IonCol, IonList, IonListHeader, IonItem, IonCardTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonToolbar, IonHeader, IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { UserLog } from 'src/app/_interfaces/UserLog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  templateUrl: './purchase.page.html',
  styles: "",
  imports: [IonIcon, IonButton, IonButtons, IonTitle, IonHeader, IonToolbar, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonItem, IonListHeader, IonList, CommonModule,IonCol, IonRow, IonGrid, IonContent]

})
export class PurchaseListComponent implements OnInit {
  purchases$: Observable<Purchase[]> | undefined;

  constructor(private router: Router, private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    // Obtener los datos del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}') as UserLog;
    const userId = userData?.user?.id;
    console.log(userId)
    // Verificar que el userId no sea null o undefined
    if (userId) {
      this.purchases$ = this.purchaseService.getPurchasesByUser(userId);
    } else {
      console.error('No se pudo encontrar el ID de usuario en el localStorage.');
    }
  }

  logout(): void {
    localStorage.removeItem('user'); // Eliminar el usuario del localStorage
    this.router.navigate(['/login']); // Redirigir al formulario de inicio de sesión
  }

}
