import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  errormessage: string = '';

  constructor(private router: Router, private fb: FormBuilder, private AuthService: AuthService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      rut: ['', [ ]],

    });

  }
}
