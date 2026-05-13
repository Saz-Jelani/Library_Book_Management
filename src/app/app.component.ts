import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent {
  showNavbar = true;
  constructor(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.showNavbar = !e.urlAfterRedirects.startsWith('/login');
    });
  }
}
