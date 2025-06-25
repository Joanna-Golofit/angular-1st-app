import { Component } from '@angular/core';
import { Roles } from '../roles/roles';
import { Designation } from '../designation/designation';

@Component({
  selector: 'app-master',
  imports: [Roles, Designation],
  templateUrl: './master.html',
  styleUrl: './master.css'
})
export class Master {
  currentComponent: string = "Roles"; // lub "Designation"
  
  switchComponent(component: string) {
    this.currentComponent = component;
  }
}
