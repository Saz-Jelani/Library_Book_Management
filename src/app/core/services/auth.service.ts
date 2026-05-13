import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const KEY = 'libraryUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === 'admin@grade.com' && password === 'admin123') {
      localStorage.setItem(KEY, JSON.stringify({ email, role: 'Admin' }));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(KEY);
    this.router.navigate(['/login']);
  }

  get currentUser(): { email: string; role: string } | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}
