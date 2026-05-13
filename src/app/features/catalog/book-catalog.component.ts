import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../core/models/library.models';
import { LibraryService } from '../../core/services/library.service';
import { IssueReturnModalComponent } from '../../shared/issue-return-modal.component';

@Component({template:`<div style='padding:16px'><h2>Catalog</h2><div style='display:grid;grid-template-columns:2fr 1fr;gap:12px'><div style='display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px'><app-book-card *ngFor="let b of books" [book]="b" (selected)="selectedBook=b"></app-book-card></div><app-book-details [book]="selectedBook" (issueRequested)="issue($event)" (editRequested)="edit($event)"></app-book-details></div></div>`})
export class BookCatalogComponent {
  books: Book[] = []; selectedBook?: Book;
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
  edit(id: string): void { this.router.navigate(['/books', id, 'edit']); }
}
