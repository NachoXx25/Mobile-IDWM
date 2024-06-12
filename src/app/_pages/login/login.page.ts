import { AuthService } from './../../_services/auth.service';
import { Component, Input, OnInit, Self, input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder, private AuthService: AuthService) {}

  ngOnInit() {
    this.initializeForm();
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

  login(){
    this.AuthService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Logged in successfully');
        this.router.navigate(['/']);
      },
      error: (result) => {
        console.log(result);
        this.errorMessage = result.error.message;
      }
    });
  }
  }


