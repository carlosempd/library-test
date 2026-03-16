import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { Book } from '@models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: Book[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) {}

  private ensureDataLoaded(): Observable<Book[]> {
    if (this.dataLoaded) {
      return of(this.books);
    }
    return this.http.get<Book[]>('assets/data/books.json').pipe(
      tap((data) => {
        this.books = data;
        this.dataLoaded = true;
      }),
    );
  }

  getBooks(): Observable<Book[]> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      map((books) => [...books]),
    );
  }

  getBookById(id: number): Observable<Book | undefined> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      map(() => this.books.find((b) => b.id === id)),
    );
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      map(() => {
        const newId =
          this.books.length > 0
            ? Math.max(...this.books.map((b) => b.id || 0)) + 1
            : 1;
        const newBook = { ...book, id: newId, registeredAt: new Date() } as Book;
        this.books = [newBook, ...this.books];
        return newBook;
      }),
    );
  }

  updateBook(book: Book): Observable<Book> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      tap(() => {
        const index = this.books.findIndex((b) => b.id === book.id);
        if (index !== -1) {
          this.books[index] = book;
        }
      }),
      map(() => book),
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      tap(() => {
        this.books = this.books.filter((b) => b.id !== id);
      }),
      map(() => undefined),
    );
  }
}
