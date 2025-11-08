import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage) },
  { path: 'signup', loadComponent: () => import('./signup-page/signup-page').then(m => m.SignupPage) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home-page/home-page').then(m => m.HomePage) },
  { path: 'post/:id', loadComponent: () => import('./post-detail/post-detail').then(m => m.PostDetailComponent) },
  { path: 'category/:slug', loadComponent: () => import('./category-page/category-page').then(m => m.CategoryPageComponent) },
  { path: 'category/:id/posts', loadComponent: () => import('./category-page/category-page').then(m => m.CategoryPageComponent) },
  { 
    path: 'create', 
    loadComponent: () => import('./post-create/post-create').then(m => m.PostCreateComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./post-edit/post-edit').then(m => m.PostEditComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./profile-page/profile-page').then(m => m.ProfilePageComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
