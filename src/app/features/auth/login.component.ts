import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  template: `<div style="max-width:420px;margin:60px auto"><mat-card><h2>Login</h2><form [formGroup]="form" (ngSubmit)="submit()"><mat-form-field appearance="outline" style="width:100%"><mat-label>Email</mat-label><input matInput formControlName="email"></mat-form-field><small *ngIf="form.controls.email.invalid && form.controls.email.touched">Valid email required</small><mat-form-field appearance="outline" style="width:100%"><mat-label>Password</mat-label><input matInput [type]="hide?'password':'text'" formControlName="password"><button mat-icon-button matSuffix type="button" (click)="hide=!hide"><mat-icon>{{hide?'visibility':'visibility_off'}}</mat-icon></button></mat-form-field><small *ngIf="form.controls.password.invalid && form.controls.password.touched">Min length 6</small><button mat-raised-button color="primary" [disabled]="loading || form.invalid" style="width:100%"> <span *ngIf="!loading">Login</span><mat-spinner *ngIf="loading" diameter="20"></mat-spinner></button></form></mat-card></div>`
})
export class LoginComponent {
  hide = true; loading = false;
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]] });
  constructor(private fb: FormBuilder, private auth: AuthService, private snack: MatSnackBar, private router: Router) {}
  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      const ok = this.auth.login(this.form.value.email!, this.form.value.password!);
      ok ? this.router.navigate(['/dashboard']) : this.snack.open('Wrong credentials', 'Close', { duration: 2000 });
    }, 800);
  }
}
