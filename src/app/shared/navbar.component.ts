import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { LibraryService } from '../core/services/library.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public auth: AuthService, private library: LibraryService) {}

  logout(): void {
    this.library.resetState();
    this.auth.logout();
  }
}
