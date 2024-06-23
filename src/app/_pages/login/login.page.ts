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
  loginForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  auth: Auth | null = null;
  role: string = '';
  isAdministrator: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private AuthService: AuthService) {}

  ngOnInit() {
    this.initializeForm();
    this.auth = this.AuthService.getCurrentAuth();
    this.assignRole();
  }

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
  assignRole() {
    this.role = this.AuthService.getRole();
  }
  getRolee(): string{
    return this.AuthService.getRole();
  }

  login(){
    this.AuthService.login(this.loginForm.value).subscribe({
      next: () => {
        if (this.role == 'Admin'){
          this.isAdministrator = true;
          this.AuthService.logout();
          console.log('Usuario no autorizado');
        }
        else if (this.role == 'Usuario'){
          console.log('Logged in successfully');
          this.router.navigate(['/']);
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


