import { Injectable, signal } from '@angular/core';

type NotificationType = 'success' | 'danger';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly message = signal('');
  readonly type = signal<NotificationType>('success');
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  show(message: string, type: NotificationType): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.message.set(message);
    this.type.set(type);
    this.timeoutId = setTimeout(() => this.dismiss(), 4000);
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.message.set('');
  }
}
