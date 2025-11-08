import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { QueryService } from '../services/query-service';
import { URLs } from '../constants/ApiConstants';
import { Router } from '@angular/router';
@Component({
  selector: 'login-page',
  imports: [CommonModule, FormsModule, ButtonModule, DividerModule, InputTextModule],
  standalone: true,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})

export class LoginPage {
  userName : string = '';
  password : string = '';
  rememberMe : boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private query: QueryService,private router:Router) {}

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.userName || !this.password) {
      this.errorMessage = 'Please provide both username and password.';
      return;
    }

    // call backend login endpoint (mock server at localhost:4000)
    console.log('Attempting login', { username: this.userName });
    this.query.login(URLs.BASE_URL+URLs.LOGIN, this.userName, this.password).subscribe({
      next: (res:any) => {
        console.log('Login response', res);
        this.successMessage = 'Signed in successfully.';
        // validate token by calling /me on the API so we confirm the token is accepted by the server
            this.router.navigateByUrl('/home')
             
      },
      error: (err:any) => {
        console.error('Login error', err);
        this.errorMessage = err?.error?.message ?? 'Login failed';
      }
    });
  }
}
