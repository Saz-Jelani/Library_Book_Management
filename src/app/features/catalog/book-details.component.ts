import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../core/models/library.models';

@Component({selector:'app-book-details',template:`<mat-card *ngIf="book"><h3>{{book.title}}</h3><p>{{book.description}}</p><p>ISBN: {{book.isbn}}</p><button mat-raised-button color="primary" (click)="issueRequested.emit(book)">Issue Book</button> <button mat-button color="accent" (click)="editRequested.emit(book.id)">Edit</button></mat-card>`})
export class BookDetailsComponent { @Input() book?: Book; @Output() issueRequested = new EventEmitter<Book>(); @Output() editRequested = new EventEmitter<string>(); }
