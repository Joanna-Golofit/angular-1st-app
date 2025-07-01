import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

interface ILoginObj {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  imports: [FormsModule, JsonPipe],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private toastService = inject(ToastService);
  
  loginObj: ILoginObj = {
    email: '',
    password: ''
  }

  onLogin() {
    if(this.loginObj.email === 'admin@admin.com' && this.loginObj.password === 'admin') {
      this.router.navigate(['/master']);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', this.loginObj.email);
    } else {
      alert('Invalid email or password');
    }
  }
}
