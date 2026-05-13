import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../core/models/library.models';

@Component({
  selector: 'app-book-card',
  template: `<mat-card class="book-card" (click)="selected.emit(book)"><img mat-card-image [src]="book.coverImage" [alt]="book.title"><mat-card-title>{{book.title}}</mat-card-title><mat-card-subtitle>{{book.author}}</mat-card-subtitle><p><strong>{{book.genre}}</strong> | {{book.language}}</p><p [style.color]="book.availableCopies > 0 ? 'green':'red'">{{book.availableCopies > 0 ? ('Available ('+book.availableCopies+')') : 'Unavailable'}}</p></mat-card>`
})
export class BookCardComponent { @Input() book!: Book; @Output() selected = new EventEmitter<Book>(); }
