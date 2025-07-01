import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private router = inject(Router);

  onLogOff() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}
