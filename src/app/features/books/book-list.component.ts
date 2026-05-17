import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../core/models/library.models';
import { LibraryService } from '../../core/services/library.service';
import { IssueReturnModalComponent } from '../../shared/issue-return-modal.component';

@Component({
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books: Book[] = [];
  filtered: Book[] = [];
  q = '';
  cols = ['select', 'title', 'author', 'avail', 'actions'];
  selectedIds = new Set<string>();
  bulkAmount = 1;

  constructor(public router: Router, private lib: LibraryService, private snack: MatSnackBar, private dialog: MatDialog) {
    this.lib.getBooks().subscribe(b => {
      this.books = b;
      this.apply();
    });
  }

  apply(): void {
    this.filtered = this.q ? this.lib.searchBooks(this.q) : this.books;
  }

  toggleOne(id: string, checked: boolean | undefined): void {
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }

  toggleAllVisible(checked: boolean | undefined): void {
    if (checked) this.filtered.forEach(b => this.selectedIds.add(b.id));
    else this.filtered.forEach(b => this.selectedIds.delete(b.id));
  }

  isAllVisibleSelected(): boolean {
    return this.filtered.length > 0 && this.filtered.every(b => this.selectedIds.has(b.id));
  }

  bulkAddCopies(): void {
    const ids = [...this.selectedIds];
    if (!ids.length) {
      this.snack.open('Select at least one book', 'Close', { duration: 1500 });
      return;
    }
    if (this.bulkAmount < 1) {
      this.snack.open('Increment must be at least 1', 'Close', { duration: 1500 });
      return;
    }
    const changed = this.lib.incrementCopies(ids, this.bulkAmount);
    this.snack.open(`Updated ${changed} book(s)`, 'Close', { duration: 1500 });
    this.selectedIds.clear();
  }

  del(id: string): void {
    const ok = this.lib.deleteBook(id);
    this.snack.open(ok ? 'Deleted' : 'Cannot delete with active issues', 'Close', { duration: 1500 });
  }

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
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'books.csv';
    a.click();
  }
}
