import { Routes } from '@angular/router';
import { Master } from './components/master/master';
import { Employee } from './components/employee/employee';
import { Client } from './components/client/client';
import { ClientProject } from './components/client-project/client-project';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'master',
        component: Master,
      },
      {
        path: 'employee',
        component: Employee,
      },
      {
        path: 'client',
        component: Client,
      },
      {
        path: 'client-project',
        component: ClientProject,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
