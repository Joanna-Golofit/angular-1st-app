import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  alertType = signal<'success' | 'danger' | 'warning' | 'info'>('success');
  message = signal<string>('');
  isVisible = signal<boolean>(false);

  showToast(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType.set(type);
    this.message.set(message);
    this.isVisible.set(true);
    
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast() {
    this.isVisible.set(false);
  }
}