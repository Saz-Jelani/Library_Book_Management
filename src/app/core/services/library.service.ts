import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book, Issue, Member } from '../models/library.models';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  readonly members: Member[] = [
    { id: 'M001', name: 'Karim Hossain', email: 'karim@mail.com', phone: '+8801711000001', category: 'Student' },
    { id: 'M002', name: 'Sumaiya Akter', email: 'sumaiya@mail.com', phone: '+8801722000002', category: 'Faculty' },
    { id: 'M003', name: 'Rahim Uddin', email: 'rahim@mail.com', phone: '+8801733000003', category: 'Public' },
    { id: 'M004', name: 'Nipa Begum', email: 'nipa@mail.com', phone: '+8801744000004', category: 'Student' },
    { id: 'M005', name: 'Tanvir Ahmed', email: 'tanvir@mail.com', phone: '+8801755000005', category: 'Staff' },
    { id: 'M006', name: 'Ritu Islam', email: 'ritu@mail.com', phone: '+8801766000006', category: 'Public' },
    { id: 'M007', name: 'Farhan Kabir', email: 'farhan@mail.com', phone: '+8801777000007', category: 'Student' },
    { id: 'M008', name: 'Mitu Das', email: 'mitu@mail.com', phone: '+8801788000008', category: 'Faculty' }
  ];

  private booksSubject = new BehaviorSubject<Book[]>([
    this.mkBook('B001', 'The Alchemist', 'Paulo Coelho', 'Fiction', 5),
    this.mkBook('B002', 'A Brief History of Time', 'Stephen Hawking', 'Science', 3),
    this.mkBook('B003', 'Clean Code', 'Robert C. Martin', 'Tech', 4),
    this.mkBook('B004', 'Sapiens', 'Yuval Noah Harari', 'History', 6),
    this.mkBook('B005', 'Rich Dad Poor Dad', 'Robert Kiyosaki', 'Self-Help', 5),
    this.mkBook('B006', "Harry Potter & the Sorcerer'00s Stone", 'J.K. Rowling', 'Fiction', 8),
    this.mkBook('B007', 'The Diary of a Young Girl', 'Anne Frank', 'Biography', 3),
    this.mkBook('B008', 'Introduction to Algorithms', 'Cormen et al.', 'Tech', 4),
    this.mkBook('B009', 'Guns, Germs, and Steel', 'Jared Diamond', 'History', 2),
    this.mkBook('B010', 'The Very Hungry Caterpillar', 'Eric Carle', 'Children', 7)
  ]);

  private issuesSubject = new BehaviorSubject<Issue[]>([]);

  getBooks(): Observable<Book[]> { return this.booksSubject.asObservable(); }
  getIssues(): Observable<Issue[]> { return this.issuesSubject.asObservable(); }

  getBookById(id: string): Book | undefined { return this.booksSubject.value.find(b => b.id === id); }

  addBook(book: Omit<Book, 'id'>): Book {
    const id = `B${String(this.booksSubject.value.length + 1).padStart(3, '0')}`;
    const created = { ...book, id };
    this.booksSubject.next([...this.booksSubject.value, created]);
    return created;
  }

  incrementCopies(bookIds: string[], amount: number): number {
    if (!bookIds.length || amount <= 0) return 0;
    const idSet = new Set(bookIds);
    let changed = 0;
    const updated = this.booksSubject.value.map(b => {
      if (!idSet.has(b.id)) return b;
      changed++;
      return {
        ...b,
        totalCopies: b.totalCopies + amount,
        availableCopies: b.availableCopies + amount
      };
    });
    if (changed > 0) this.booksSubject.next(updated);
    return changed;
  }

  updateBook(id: string, updates: Partial<Book>): Book | null {
    const books = this.booksSubject.value;
    const idx = books.findIndex(b => b.id === id);
    if (idx < 0) return null;
    const current = books[idx];
    let availableCopies = typeof updates.availableCopies === 'number' ? updates.availableCopies : current.availableCopies;
    if (typeof updates.totalCopies === 'number' && updates.totalCopies !== current.totalCopies) {
      const active = this.getIssuesByBook(id).filter(i => i.status === 'Issued').length;
      availableCopies = Math.max(0, updates.totalCopies - active);
    }
    const updated: Book = { ...current, ...updates, availableCopies };
    books[idx] = updated;
    this.booksSubject.next([...books]);
    return updated;
  }

  deleteBook(id: string): boolean {
    const active = this.getIssuesByBook(id).filter(i => i.status === 'Issued').length;
    if (active > 0) return false;
    this.booksSubject.next(this.booksSubject.value.filter(b => b.id !== id));
    return true;
  }

  searchBooks(query: string): Book[] {
    const q = query.toLowerCase().trim();
    return this.booksSubject.value.filter(b =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || String(b.isbn).includes(q) || b.genre.toLowerCase().includes(q));
  }

  getBooksByGenre(genre: string): Book[] { return this.booksSubject.value.filter(b => b.genre === genre); }
  getLowStockBooks(threshold = 1): Book[] { return this.booksSubject.value.filter(b => b.availableCopies <= threshold); }

  getIssuesByBook(bookId: string): Issue[] { return this.issuesSubject.value.filter(i => i.bookId === bookId); }
  getIssuesByMember(memberId: string): Issue[] { return this.issuesSubject.value.filter(i => i.memberId === memberId); }
  getActiveIssues(): Issue[] { return this.syncOverdues().filter(i => i.status === 'Issued'); }
  getOverdueIssues(): Issue[] { return this.syncOverdues().filter(i => i.status === 'Overdue'); }

  issueBook(bookId: string, memberId: string, dueDate?: Date): Issue {
    const book = this.getBookById(bookId);
    if (!book || book.availableCopies <= 0) throw new Error('Book unavailable');
    if (this.getActiveIssues().filter(i => i.memberId === memberId).length >= 3) throw new Error('Member issue limit reached');
    const issue: Issue = {
      id: `I${String(this.issuesSubject.value.length + 1).padStart(3, '0')}`,
      bookId,
      memberId,
      issueDate: new Date(),
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000),
      returnDate: null,
      status: 'Issued',
      fineAmount: 0,
      renewalCount: 0,
      issuedBy: 'Admin'
    };
    this.issuesSubject.next([...this.issuesSubject.value, issue]);
    this.updateBook(bookId, { availableCopies: book.availableCopies - 1 });
    return issue;
  }

  returnBook(issueId: string): Issue {
    const issues = this.syncOverdues();
    const idx = issues.findIndex(i => i.id === issueId);
    if (idx < 0) throw new Error('Issue not found');
    const issue = issues[idx];
    if (issue.returnDate) return issue;
    const now = new Date();
    const overdueDays = Math.max(0, Math.floor((now.getTime() - new Date(issue.dueDate).getTime()) / 86400000));
    const updated = { ...issue, returnDate: now, status: 'Returned' as const, fineAmount: overdueDays * 5 };
    issues[idx] = updated;
    this.issuesSubject.next([...issues]);
    const book = this.getBookById(issue.bookId);
    if (book) this.updateBook(book.id, { availableCopies: book.availableCopies + 1 });
    return updated;
  }

  renewBook(issueId: string): Issue {
    const issues = this.syncOverdues();
    const idx = issues.findIndex(i => i.id === issueId);
    if (idx < 0) throw new Error('Issue not found');
    const issue = issues[idx];
    if (issue.renewalCount >= 2) throw new Error('Max renewal exceeded');
    const updated = { ...issue, dueDate: new Date(new Date(issue.dueDate).getTime() + 14 * 86400000), renewalCount: issue.renewalCount + 1, status: 'Issued' as const };
    issues[idx] = updated;
    this.issuesSubject.next([...issues]);
    return updated;
  }



  getMonthlyIssueCount(): { month: string; count: number }[] {
    const now = new Date();
    const out: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = dt.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const count = this.issuesSubject.value.filter(x => {
        const d = new Date(x.issueDate);
        return d.getMonth() === dt.getMonth() && d.getFullYear() === dt.getFullYear();
      }).length;
      out.push({ month, count });
    }
    return out;
  }

  resetState(): void { this.issuesSubject.next([]); }

  private syncOverdues(): Issue[] {
    const now = new Date();
    let changed = false;
    const updated = this.issuesSubject.value.map(i => {
      if (!i.returnDate && new Date(i.dueDate) < now) {
        const days = Math.max(0, Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / 86400000));
        const nextFine = days * 5;
        if (i.status !== 'Overdue' || i.fineAmount !== nextFine) {
          changed = true;
          return { ...i, status: 'Overdue' as const, fineAmount: nextFine };
        }
        return i;
      }
      if (!i.returnDate && i.status === 'Overdue') {
        changed = true;
        return { ...i, status: 'Issued' as const, fineAmount: 0 };
      }
      return i;
    });
    if (changed) {
      this.issuesSubject.next(updated);
    }
    return updated;
  }

  private mkBook(id: string, title: string, author: string, genre: Book['genre'], copies: number): Book {
    return {
      id, title, author, genre, totalCopies: copies, availableCopies: copies,
      isbn: Number(`9780000000${id.slice(1)}`.slice(0, 13)),
      publicationDate: new Date(2015, 1, 1), publisher: 'Sample Publisher', language: 'English', pages: 250,
      coverImage: 'https://via.placeholder.com/180x250?text=Book', description: `${title} summary.`, rating: 4.2
    };
  }
}
