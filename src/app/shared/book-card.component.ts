import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../core/models/library.models';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() selected = new EventEmitter<Book>();
}
