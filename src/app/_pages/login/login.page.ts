import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { Auth } from 'src/app/_interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: []
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = new FormGroup({}); // Variable para guardar el formulario de login
  errorMessage: string = ''; // Variable para guardar el mensaje de error
  auth: Auth | null = null; // Variable para guardar la autenticación del usuario
  role: string = ''; // Variable para guardar el role del usuario
  isAdministrator: boolean = false; // Variable para verificar si el usuario es administrador o no

  constructor(private router: Router, private fb: FormBuilder, private AuthService: AuthService) {} // Inyecta el servicio de autenticación

  ngOnInit() {
    this.auth = this.AuthService.getCurrentAuth();
    this.initializeForm();
  }
  /**
   * Inicializa el formulario de login
   */
  initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ]]
    });
  }
  /**
   *  Obtiene el role del usuario
   * @returns Role del usuario
   */
  getRolee(): string{
    return this.AuthService.getRole();
  }
  /**
   * Login de clientes (denega acceso a administrador)
   */
  async login(){
    this.errorMessage = '';
    this.isAdministrator = false;
    await this.AuthService.login(this.loginForm.value).subscribe({
      next: () => {
        this.role = this.AuthService.getRole();
        if (this.role == 'Admin'){
          this.isAdministrator = true;
          this.AuthService.logout();
          console.log('Usuario no autorizado');
        }
        else if (this.role == 'Usuario'){
          console.log('Logged in successfully');
          this.router.navigate(['/purchases/']);
        }
        else {
          this.isAdministrator = true;
          this.AuthService.logout();
          console.log('Usuario no autorizado');
        }
      },
      error: (result) => {
        if (typeof result.error === 'string') {
          this.errorMessage = result.error;
        } else {
          this.errorMessage = 'Intente nuevamente';
        }
      },
    });
  }
  }


