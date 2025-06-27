import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './pages/login/login'; 

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    canActivate: [authGuard]
  },

  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then(m => m.Services),
    canActivate: [authGuard]
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers').then(m => m.Careers),
    canActivate: [authGuard]
  },
  {
    path: 'testimonials',
    loadComponent: () => import('./pages/testimonials/testimonials').then(m => m.Testimonials),
    canActivate: [authGuard]
  },

  {
    path: 'addservice',
    loadComponent: () => import('./pages/addservice/addservice').then(m => m.Addservice),
    canActivate: [authGuard]
  },

  {
    path: 'editservice/:id',
    loadComponent: () => import('./pages/editservice/editservice').then(m => m.Editservice),
    canActivate: [authGuard] 
  },


  {
    path: 'addtestimonial',
    loadComponent: () => import('./pages/addtestimonial/addtestimonial').then(m => m.Addtestimonial),
    canActivate: [authGuard] 
  },

  {
    path: 'edittestimonial/:id',
    loadComponent: () => import('./pages/edittestimonial/edittestimonial').then(m => m.Edittestimonial),
    canActivate: [authGuard]
  },

  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.Contact),
    canActivate: [authGuard]
  },


  {
    path: '**',
    redirectTo: 'login'
  }
];

