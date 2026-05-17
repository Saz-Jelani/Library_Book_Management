import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../core/models/library.models';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  @Input() book?: Book;
  @Output() issueRequested = new EventEmitter<Book>();
  @Output() editRequested = new EventEmitter<string>();
}
