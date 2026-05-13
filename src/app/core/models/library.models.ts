export type Genre = 'Fiction' | 'Non-Fiction' | 'Science' | 'History' | 'Tech' | 'Children' | 'Biography' | 'Self-Help';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: number;
  genre: Genre;
  publicationDate: Date;
  totalCopies: number;
  availableCopies: number;
  publisher: string;
  language: string;
  pages: number;
  coverImage: string;
  description: string;
  rating: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'Student' | 'Faculty' | 'Public' | 'Staff';
}

export interface Issue {
  id: string;
  bookId: string;
  memberId: string;
  issueDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
  renewalCount: number;
  issuedBy: string;
}
