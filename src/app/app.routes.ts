import { Routes } from '@angular/router';
import { Designation } from './components/designation/designation';
import { Master } from './components/master/master';
import { Employee } from './components/employee/employee';
import { Client } from './components/client/client';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'master',
        pathMatch: 'full'
        // component: Des.ignation
    },
    {
        path: 'master',
        component: Master
    },
    {
        path: 'employee',
        component: Employee
    },
    {
        path: 'client',
        component: Client
    }
];
