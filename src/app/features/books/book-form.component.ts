import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryService } from '../../core/services/library.service';

@Component({
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  id: string | null = null;
  genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Tech', 'Children', 'Biography', 'Self-Help'];
  langs = ['English', 'Bangla', 'Arabic', 'French', 'Spanish'];
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    author: ['', Validators.required],
    isbn: [null as any, [Validators.required, Validators.pattern(/^\d{13}$/)]],
    genre: ['Fiction', Validators.required],
    publicationDate: [new Date(), Validators.required],
    totalCopies: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    publisher: [''],
    language: ['English', Validators.required],
    pages: [1, [Validators.required, Validators.min(1)]],
    description: [''],
    coverImage: ['https://via.placeholder.com/180x250?text=Book'],
    rating: [4.2],
    availableCopies: [1]
  });

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
