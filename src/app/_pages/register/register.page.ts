import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  firstItemSelect: string = 'Masculino';
  secondItemSelect: string = 'Femenino';
  tirthItemSelect: string = 'Prefiero no decir';
  fourthItemSelect: string = 'Otro';
  errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder, private AuthService: AuthService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      rut:  ['', [Validators.required, this.validateRut()]],
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      birthday: ['', [Validators.required, this.validateDate()]],
      genderId: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });

  }

  register() {
    this.AuthService.register(this.registerForm.value).subscribe({
      next: () => {
        console.log('Usuario registrado');
        this.router.navigate(['/']);
      },
      error: (result) => {
        if (typeof result.error === 'string') {
          this.errorMessage = result.error;
        } else {
          this.errorMessage = 'Intente nuevamente';
        }
      }
    });
  }
  validateRut(): ValidatorFn {
    return (control: AbstractControl) => {
      const rut = control.value;

      if (!rut) {
        return null;
      }

      const rutPattern = /^[1-9]\d{0,7}-[kK\d]$/;
      if (!rutPattern.test(rut)) {
        return { invalidRut: true };
      }

      const [number, verifier] = rut.split('-');

      let sum = 0;
      let multiplier = 2;

      for (let i = number.length - 1; i >= 0; i--) {
        sum += parseInt(number.charAt(i), 10) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
      }

      let calculatedVerifier: string;
      const modulus = 11 - (sum % 11);

      if (modulus === 11) {
        calculatedVerifier = '0';
      } else if (modulus === 10) {
        calculatedVerifier = 'K';
      } else {
        calculatedVerifier = modulus.toString();
      }

      if (calculatedVerifier.toUpperCase() !== verifier.toUpperCase()) {
        return { invalidRut: true };
      }

      return null;
    };
  }

  validateDate(): ValidatorFn {
    return (control: AbstractControl) => {
      const date = control.value;

      if (!date) {
        return null;
      }

      const datePattern =
        /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

      if (!datePattern.test(date)) {
        return { invalidDateFormat: true };
      }

      const [day, month, year] = date.split('/').map(Number);

      const dateObj = new Date(year, month - 1, day);

      const today = new Date();
      if (dateObj >= today) {
        return { futureDate: true };
      }

      return null;
    };
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { noMatching: true };
    };
  }
}
