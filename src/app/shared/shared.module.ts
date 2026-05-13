import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NavbarComponent } from './navbar.component';
import { BookCardComponent } from './book-card.component';
import { IssueReturnModalComponent } from './issue-return-modal.component';

@NgModule({
  declarations: [NavbarComponent, BookCardComponent, IssueReturnModalComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule, MatCheckboxModule, MatSlideToggleModule, MatAutocompleteModule],
  exports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule, MatCheckboxModule, MatSlideToggleModule, MatAutocompleteModule, NavbarComponent, BookCardComponent, IssueReturnModalComponent]
})
export class SharedModule {}
