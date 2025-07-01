import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if(isLoggedIn === 'true') {
    // User już zalogowany - przekieruj do master
    router.navigate(['/master']);
    return false;
  } else {
    // User nie zalogowany - pokaż login page
    return true;
  }
};