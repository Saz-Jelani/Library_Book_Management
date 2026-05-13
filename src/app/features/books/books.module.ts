import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BookListComponent } from './book-list.component';
import { BookFormComponent } from './book-form.component';
const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'new', component: BookFormComponent },
  { path: ':id/edit', component: BookFormComponent }
];
@NgModule({ declarations: [BookListComponent, BookFormComponent], imports: [SharedModule, RouterModule.forChild(routes)] })
export class BooksModule {}
