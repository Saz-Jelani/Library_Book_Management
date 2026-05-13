import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { LibraryService } from '../core/services/library.service';

@Component({
  selector: 'app-navbar',
  template: `<mat-toolbar color="primary"><span>Library Book Management</span><span style="flex:1"></span><a mat-button routerLink="/dashboard">Dashboard</a><a mat-button routerLink="/catalog">Catalog</a><a mat-button routerLink="/books">Books</a><a mat-button routerLink="/issues">Issues</a><a mat-button routerLink="/analytics">Analytics</a><span style="margin:0 12px">{{auth.currentUser?.email}}</span><button mat-raised-button color="accent" (click)="logout()">Logout</button></mat-toolbar>`
})
export class NavbarComponent {
  constructor(public auth: AuthService, private library: LibraryService) {}
  logout(): void { this.library.resetState(); this.auth.logout(); }
}
