import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { QueryService } from '../services/query-service';
import { URLs } from '../constants/ApiConstants';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, MessageModule, RouterModule],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css']
})
export class SignupPage {
  userName: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  name: string = '';
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private query: QueryService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.errorMessage = null;

    if (!this.userName || !this.password || !this.email || !this.name) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    this.loading = true;

    const signupData = {
      userName: this.userName,
      password: this.password,
      email: this.email,
      name: this.name
    };

    this.query.runPostQuery(URLs.BASE_URL + URLs.REGISTER, signupData).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Auto-login after signup
        this.query.login(URLs.BASE_URL + URLs.LOGIN, this.userName, this.password).subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigateByUrl(returnUrl);
          },
          error: () => {
            // If auto-login fails, redirect to login page
            this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
          }
        });
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Signup error', err);
        this.errorMessage = err?.error?.message ?? err?.error?.error ?? 'Registration failed. Please try again.';
      }
    });
  }
}

