import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { LibraryService } from '../../core/services/library.service';

@Component({
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent {
  totalBooks = 0;
  totalMembers = 0;
  active = 0;
  overdue = 0;
  genreData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Books by Genre' }] };
  monthlyData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Issues', tension: 0.4 }, { data: [], label: 'Returns', borderDash: [5, 5], tension: 0.4 }] };

  constructor(private lib: LibraryService) {
    this.totalMembers = lib.members.length;
    lib.getBooks().subscribe(bs => {
      this.totalBooks = bs.length;
      const g = new Map<string, number>();
      bs.forEach(b => g.set(b.genre, (g.get(b.genre) || 0) + 1));
      this.genreData = { labels: [...g.keys()], datasets: [{ data: [...g.values()], label: 'Books by Genre' }] };
    });

    lib.getIssues().subscribe(issues => {
      this.active = lib.getActiveIssues().length;
      this.overdue = lib.getOverdueIssues().length;
      const monthly = lib.getMonthlyIssueCount();
      const returns = monthly.map(m => issues.filter(i => i.returnDate && new Date(i.returnDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) === m.month).length);
      this.monthlyData = {
        labels: monthly.map(m => m.month),
        datasets: [
          { data: monthly.map(m => m.count), label: 'Issues', tension: 0.4 },
          { data: returns, label: 'Returns', borderDash: [5, 5], tension: 0.4 }
        ]
      };
    });
  }
}
