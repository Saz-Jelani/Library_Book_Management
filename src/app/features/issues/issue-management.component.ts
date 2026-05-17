import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Issue } from '../../core/models/library.models';
import { LibraryService } from '../../core/services/library.service';

@Component({
  templateUrl: './issue-management.component.html',
  styleUrls: ['./issue-management.component.css']
})
export class IssueManagementComponent {
  all: Issue[] = [];
  active: Issue[] = [];
  overdue: Issue[] = [];
  cols = ['id', 'member', 'due', 'actions'];
  overCols = ['id', 'fine'];
  histCols = ['id', 'status'];

  constructor(private lib: LibraryService, private snack: MatSnackBar) {
    this.lib.getIssues().subscribe(v => {
      this.all = v;
      this.refresh();
    });
    this.refresh();
  }

  refresh(): void {
    this.active = this.lib.getActiveIssues();
    this.overdue = this.lib.getOverdueIssues();
  }

  ret(id: string): void {
    this.lib.returnBook(id);
    this.refresh();
  }

  renew(id: string): void {
    try {
      const updated = this.lib.renewBook(id);
      if (updated.renewalCount >= 2) {
        this.snack.open('Max renewal exceeded', 'Close', { duration: 1800 });
      }
    } catch (err: any) {
      this.snack.open(err?.message || 'Renew failed', 'Close', { duration: 1800 });
    }
    this.refresh();
  }
}
