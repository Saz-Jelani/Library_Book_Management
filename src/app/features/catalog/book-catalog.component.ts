import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../core/models/library.models';
import { LibraryService } from '../../core/services/library.service';
import { IssueReturnModalComponent } from '../../shared/issue-return-modal.component';

@Component({
  templateUrl: './book-catalog.component.html',
  styleUrls: ['./book-catalog.component.css']
})
export class BookCatalogComponent {
  books: Book[] = [];
  selectedBook?: Book;

  constructor(private lib: LibraryService, private dialog: MatDialog, private router: Router) {
    this.lib.getBooks().subscribe(v => {
      this.books = v;
      if (this.selectedBook) {
        this.selectedBook = v.find(b => b.id === this.selectedBook?.id);
      }
    });
  }

  issue(book: Book): void {
    this.dialog.open(IssueReturnModalComponent, { width: '520px', data: { book } });
  }

  edit(id: string): void {
    this.router.navigate(['/books', id, 'edit']);
  }
}
