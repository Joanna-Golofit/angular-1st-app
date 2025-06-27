import { Routes } from '@angular/router';
import { Master } from './components/master/master';
import { Employee } from './components/employee/employee';
import { Client } from './components/client/client';
import { ClientProject } from './components/client-project/client-project';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'master',
    pathMatch: 'full',
  },
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
  {
    path: '**',
    redirectTo: '/master',
  },
];
