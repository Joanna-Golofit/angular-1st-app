import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
  alertType = input<'success' | 'danger' | 'warning' | 'info'>('success');
  message = input<string>('');
}
