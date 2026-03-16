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
      published: false,
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
