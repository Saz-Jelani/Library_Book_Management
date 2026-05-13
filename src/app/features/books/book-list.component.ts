import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../core/models/library.models';
import { LibraryService } from '../../core/services/library.service';
import { IssueReturnModalComponent } from '../../shared/issue-return-modal.component';

@Component({template:`<div style='padding:16px'><h2>Books</h2><button mat-raised-button color='primary' routerLink='/books/new'>Add Book</button> <button mat-stroked-button (click)='exportCsv()'>Export CSV</button><mat-form-field><input matInput placeholder='Search' [(ngModel)]='q' (ngModelChange)='apply()'></mat-form-field><table mat-table [dataSource]='filtered'><ng-container matColumnDef='title'><th mat-header-cell *matHeaderCellDef>Title</th><td mat-cell *matCellDef='let b'>{{b.title}}</td></ng-container><ng-container matColumnDef='author'><th mat-header-cell *matHeaderCellDef>Author</th><td mat-cell *matCellDef='let b'>{{b.author}}</td></ng-container><ng-container matColumnDef='avail'><th mat-header-cell *matHeaderCellDef>Available</th><td mat-cell *matCellDef='let b'>{{b.availableCopies}}</td></ng-container><ng-container matColumnDef='actions'><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef='let b'><button mat-button (click)='router.navigate(["/catalog"])'>View</button><button mat-button (click)='router.navigate(["/books",b.id,"edit"])'>Edit</button><button mat-button (click)='issue(b.id)'>Issue</button><button mat-button color='warn' (click)='del(b.id)'>Delete</button></td></ng-container><tr mat-header-row *matHeaderRowDef='cols'></tr><tr mat-row *matRowDef='let row; columns: cols'></tr></table></div>`})
export class BookListComponent {
  books: Book[] = []; filtered: Book[] = []; q = ''; cols = ['title', 'author', 'avail', 'actions'];
  constructor(public router: Router, private lib: LibraryService, private snack: MatSnackBar, private dialog: MatDialog) { this.lib.getBooks().subscribe(b => { this.books = b; this.apply(); }); }
  apply(): void { this.filtered = this.q ? this.lib.searchBooks(this.q) : this.books; }
  del(id: string): void { const ok = this.lib.deleteBook(id); this.snack.open(ok ? 'Deleted' : 'Cannot delete with active issues', 'Close', { duration: 1500 }); }
  issue(bookId: string): void {
    const book = this.lib.getBookById(bookId);
    if (!book) {
      this.snack.open('Book not found', 'Close', { duration: 1500 });
      return;
    }
    this.dialog.open(IssueReturnModalComponent, { width: '520px', data: { book } });
  }
  exportCsv(): void {
    const lines = ['id,title,author,isbn,genre,availableCopies', ...this.books.map(b => `${b.id},"${b.title}","${b.author}",${b.isbn},${b.genre},${b.availableCopies}`)];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'books.csv'; a.click();
  }
}
