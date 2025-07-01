import { Routes } from '@angular/router';
import { Master } from './components/master/master';
import { Employee } from './components/employee/employee';
import { Client } from './components/client/client';
import { ClientProject } from './components/client-project/client-project';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { authGuard } from './services/auth-guard';
import { loginGuard } from './services/login-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard],  // zalogowany user niepowinien miec tu dostepu
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'master',
        component: Master,
        // canActivate: [authGuard],
      },
      {
        path: 'employee',
        component: Employee,
        // canActivate: [authGuard],
      },
      {
        path: 'client',
        component: Client,
        // canActivate: [authGuard],
      },
      {
        path: 'client-project',
        component: ClientProject,
        // canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
