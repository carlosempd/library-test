import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Book } from '@models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: 'Cien años de soledad',
      authorId: 1,
      description: 'The story of the Buendía family in the town of Macondo.',
      published: true,
      yearPublished: 1967,
      registeredAt: new Date(),
    },
    {
      id: 2,
      title: 'La casa de los espíritus',
      authorId: 2,
      description: 'A multi-generational story following the Trueba family.',
      published: true,
      yearPublished: 1982,
      registeredAt: new Date(),
    },
    {
      id: 3,
      title: 'El Aleph',
      authorId: 3,
      description: 'A collection of short stories exploring philosophical themes.',
      published: true,
      yearPublished: 1949,
      registeredAt: new Date(),
    },
    {
      id: 4,
      title: 'Rayuela',
      authorId: 4,
      description: 'An experimental novel that can be read in multiple sequences.',
      published: true,
      yearPublished: 1963,
      registeredAt: new Date(),
    },
    {
      id: 5,
      title: 'La ciudad y los perros',
      authorId: 5,
      description: 'A novel about the lives of cadets at a military academy.',
      published: true,
      yearPublished: 1963,
      registeredAt: new Date(),
    },
    {
      id: 6,
      title: 'The Great Gatsby',
      authorId: 11,
      description: 'A story of the fabulously wealthy Jay Gatsby.',
      published: true,
      yearPublished: 1925,
      registeredAt: new Date(),
    },
    {
      id: 7,
      title: 'Pride and Prejudice',
      authorId: 12,
      description: 'The story of Elizabeth Bennet and Mr. Darcy.',
      published: true,
      yearPublished: 1813,
      registeredAt: new Date(),
    },
    {
      id: 8,
      title: 'To the Lighthouse',
      authorId: 10,
      description: 'A landmark of high modernism.',
      published: true,
      yearPublished: 1927,
      registeredAt: new Date(),
    },
    {
      id: 9,
      title: 'The Old Man and the Sea',
      authorId: 9,
      description: 'A story about an epic battle between an aging fisherman and a giant marlin.',
      published: true,
      yearPublished: 1952,
      registeredAt: new Date(),
    },
    {
      id: 10,
      title: 'Anna Karenina',
      authorId: 14,
      description: 'A complex novel exploring themes of love, family, and society.',
      published: true,
      yearPublished: 1877,
      registeredAt: new Date(),
    },
    {
      id: 11,
      title: 'Crime and Punishment',
      authorId: 15,
      description: 'The story of Rodion Raskolnikov and his search for redemption.',
      published: true,
      yearPublished: 1866,
      registeredAt: new Date(),
    },
    {
      id: 12,
      title: 'Oliver Twist',
      authorId: 13,
      description: 'The story of an orphan born in a workhouse.',
      published: true,
      yearPublished: 1838,
      registeredAt: new Date(),
    },
    {
      id: 13,
      title: 'Great Expectations',
      authorId: 13,
      description: 'The growth and personal development of an orphan named Pip.',
      published: true,
      yearPublished: 1861,
      registeredAt: new Date(),
    },
    {
      id: 14,
      title: 'A Tale of Two Cities',
      authorId: 13,
      description: 'Set in London and Paris before and during the French Revolution.',
      published: true,
      yearPublished: 1859,
      registeredAt: new Date(),
    },
    {
      id: 15,
      title: 'Pedro Páramo',
      authorId: 1,
      description: 'A seminal novel in the magic realism genre.',
      published: true,
      yearPublished: 1955,
      registeredAt: new Date(),
    },
    {
      id: 16,
      title: 'Aura',
      authorId: 8,
      description: 'A short novel exploring themes of memory and identity.',
      published: false,
      yearPublished: 1962,
      registeredAt: new Date(),
    },
  ];

  constructor() {}

  getBooks(): Observable<Book[]> {
    return of([...this.books]).pipe(delay(500));
  }

  getBookById(id: number): Observable<Book | undefined> {
    const book = this.books.find((b) => b.id === id);
    return of(book).pipe(delay(500));
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    const newId =
      this.books.length > 0
        ? Math.max(...this.books.map((b) => b.id || 0)) + 1
        : 1;
    const newBook = { ...book, id: newId, registeredAt: new Date() } as Book;
    return of(newBook).pipe(
      delay(500),
      tap((b) => {
        this.books = [b, ...this.books];
      }),
    );
  }

  updateBook(book: Book): Observable<Book> {
    return of(book).pipe(
      delay(500),
      tap((updatedBook) => {
        const index = this.books.findIndex((b) => b.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
      }),
    );
  }

  deleteBook(id: number): Observable<void> {
    return of(undefined).pipe(
      delay(500),
      tap(() => {
        this.books = this.books.filter((b) => b.id !== id);
      }),
    );
  }
}
