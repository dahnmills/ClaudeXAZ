import { Injectable, signal } from '@angular/core';

const KEY = 'hub_admin';
const SECRET = 'qirin2026';

@Injectable({ providedIn: 'root' })
export class HubAdminService {
  readonly isAdmin = signal(localStorage.getItem(KEY) === '1');

  unlock(key: string): boolean {
    if (key !== SECRET) return false;
    localStorage.setItem(KEY, '1');
    this.isAdmin.set(true);
    return true;
  }
}
