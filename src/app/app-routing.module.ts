import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
// import { RedirectIfLoggedInGuard } from './core/guards/auth.guard';
import { RedirectIfLoggedInGuard } from './core/guards/redirect-if-logged-in.guard';

const routes: Routes = [
  { path: 'login', canActivate: [RedirectIfLoggedInGuard], loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'catalog', canActivate: [AuthGuard], loadChildren: () => import('./features/catalog/catalog.module').then(m => m.CatalogModule) },
  { path: 'books', canActivate: [AuthGuard], loadChildren: () => import('./features/books/books.module').then(m => m.BooksModule) },
  { path: 'issues', canActivate: [AuthGuard], loadChildren: () => import('./features/issues/issues.module').then(m => m.IssuesModule) },
  { path: 'analytics', canActivate: [AuthGuard], loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
