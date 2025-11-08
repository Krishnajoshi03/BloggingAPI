import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, AvatarModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  user: any = null;
  private tokenSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.tokenSubscription = this.authService.token$.subscribe(() => {
      this.checkAuth();
    });
  }

  ngOnDestroy() {
    this.tokenSubscription?.unsubscribe();
  }

  checkAuth() {
    const token = this.authService.token;
    this.isAuthenticated = !!token;
    if (this.isAuthenticated) {
      this.user = this.authService.getUser();
    } else {
      this.user = null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    const name = this.user.name || this.user.userName || this.user.username || '';
    if (name.includes(' ')) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name.charAt(0).toUpperCase() || 'U';
  }
}

