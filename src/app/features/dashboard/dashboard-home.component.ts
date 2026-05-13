import { Component } from '@angular/core';
import { LibraryService } from '../../core/services/library.service';
@Component({template:`<div style='padding:16px'><h2>Dashboard</h2><p>Total Books: {{totalBooks}} | Total Members: {{members}} | Active Issues: {{active}} | Overdue: {{overdue}}</p></div>`})
export class DashboardHomeComponent { totalBooks = 0; members = 0; active = 0; overdue = 0; constructor(lib: LibraryService){lib.getBooks().subscribe(b=>this.totalBooks=b.length); this.members=lib.members.length; this.active=lib.getActiveIssues().length; this.overdue=lib.getOverdueIssues().length;} }
