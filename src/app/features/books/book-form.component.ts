import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../core/services/library.service';

@Component({template:`<div style='padding:16px;max-width:760px'><h2>{{id ? 'Edit' : 'Add'}} Book</h2><form [formGroup]='form' (ngSubmit)='submit()'><div style='display:grid;grid-template-columns:1fr 1fr;gap:12px'><mat-form-field><mat-label>Title</mat-label><input matInput formControlName='title'></mat-form-field><mat-form-field><mat-label>Author</mat-label><input matInput formControlName='author'></mat-form-field><mat-form-field><mat-label>ISBN</mat-label><input matInput type='number' formControlName='isbn'></mat-form-field><mat-form-field><mat-label>Genre</mat-label><mat-select formControlName='genre'><mat-option *ngFor='let g of genres' [value]='g'>{{g}}</mat-option></mat-select></mat-form-field><mat-form-field><mat-label>Publication Date</mat-label><input matInput [matDatepicker]='picker' formControlName='publicationDate'><mat-datepicker-toggle matSuffix [for]='picker'></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field><mat-form-field><mat-label>Total Copies</mat-label><input matInput type='number' formControlName='totalCopies'></mat-form-field><mat-form-field><mat-label>Publisher</mat-label><input matInput formControlName='publisher'></mat-form-field><mat-form-field><mat-label>Language</mat-label><mat-select formControlName='language'><mat-option *ngFor='let l of langs' [value]='l'>{{l}}</mat-option></mat-select></mat-form-field><mat-form-field><mat-label>Pages</mat-label><input matInput type='number' formControlName='pages'></mat-form-field><mat-form-field style='grid-column:span 2'><mat-label>Description</mat-label><textarea matInput maxlength='300' formControlName='description'></textarea></mat-form-field></div><button mat-raised-button color='primary' [disabled]='form.invalid'>Save</button></form></div>`})
export class BookFormComponent {
  id: string | null = null;
  genres = ['Fiction','Non-Fiction','Science','History','Tech','Children','Biography','Self-Help'];
  langs = ['English','Bangla','Arabic','French','Spanish'];
  form = this.fb.group({ title: ['', [Validators.required, Validators.minLength(2)]], author: ['', Validators.required], isbn: [null as any, [Validators.required, Validators.pattern(/^\d{13}$/)]], genre: ['Fiction', Validators.required], publicationDate: [new Date(), Validators.required], totalCopies: [1, [Validators.required, Validators.min(1), Validators.max(100)]], publisher: [''], language: ['English', Validators.required], pages: [1, [Validators.required, Validators.min(1)]], description: [''], coverImage: ['https://via.placeholder.com/180x250?text=Book'], rating: [4.2], availableCopies: [1] });
  constructor(private fb: FormBuilder, private lib: LibraryService, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const b = this.lib.getBookById(this.id);
      if (b) this.form.patchValue(b as any);
    }
  }
  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    if (new Date(v.publicationDate) > new Date()) {
      this.snack.open('Publication date cannot be future', 'Close');
      return;
    }
    if (this.id) this.lib.updateBook(this.id, v); else this.lib.addBook(v);
    this.snack.open('Saved successfully', 'Close', { duration: 1500 });
    this.router.navigate(['/books']);
  }
}
