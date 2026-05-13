import { Component, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book, Member } from '../core/models/library.models';
import { LibraryService } from '../core/services/library.service';

@Component({
  selector: 'app-issue-return-modal',
  templateUrl: './issue-return-modal.component.html',
  styleUrls: ['./issue-return-modal.component.css']
})
export class IssueReturnModalComponent {
  query = '';
  selectedMemberId = '';
  dueDate = new Date(Date.now() + 14 * 86400000);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { book: Book },
    private dialogRef: MatDialogRef<IssueReturnModalComponent>,
    private libraryService: LibraryService,
    private snack: MatSnackBar
  ) {}

  get members(): Member[] {
    return this.libraryService.members;
  }

  get filteredMembers(): Member[] {
    const q = this.query.toLowerCase().trim();
    if (!q) return this.members;
    return this.members.filter(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
  }

  onMemberSelected(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.value as string) || '';
    this.selectedMemberId = value.split(' - ')[0]?.trim() || '';
  }

  get limitWarning(): boolean {
    if (!this.selectedMemberId) return false;
    return this.libraryService.getActiveIssues().filter(i => i.memberId === this.selectedMemberId).length >= 3;
  }

  get canIssue(): boolean {
    return !!this.selectedMemberId && this.currentAvailableCopies > 0 && this.dueDate > new Date() && !this.limitWarning;
  }

  get currentAvailableCopies(): number {
    return this.libraryService.getBookById(this.data.book.id)?.availableCopies ?? 0;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    try {
      this.libraryService.issueBook(this.data.book.id, this.selectedMemberId, this.dueDate);
      this.snack.open('Book issued successfully', 'Close', { duration: 1800 });
      this.dialogRef.close(true);
    } catch (e: any) {
      this.snack.open(e.message || 'Failed to issue book', 'Close', { duration: 2200 });
    }
  }
}
