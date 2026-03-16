import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Author } from '@models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private authors: Author[] = [
    { id: 1, name: 'Gabriel García Márquez', genre: 'Realismo Mágico' },
    { id: 2, name: 'Isabel Allende', genre: 'Realismo Mágico' },
    { id: 3, name: 'Jorge Luis Borges', genre: 'Realismo Mágico' },
    { id: 4, name: 'Julio Cortázar', genre: 'Realismo Mágico' },
    { id: 5, name: 'Mario Vargas Llosa', genre: 'Realismo Mágico' },
    { id: 6, name: 'Pablo Neruda', genre: 'Poetry' },
    { id: 7, name: 'Octavio Paz', genre: 'Poetry' },
    { id: 8, name: 'Carlos Fuentes', genre: 'Novel' },
    { id: 9, name: 'Ernest Hemingway', genre: 'Literature' },
    { id: 10, name: 'Virginia Woolf', genre: 'Modernism' },
    { id: 11, name: 'F. Scott Fitzgerald', genre: 'Modernism' },
    { id: 12, name: 'Jane Austen', genre: 'Classic' },
    { id: 13, name: 'Charles Dickens', genre: 'Classic' },
    { id: 14, name: 'Leo Tolstoy', genre: 'Classic' },
    { id: 15, name: 'Fyodor Dostoevsky', genre: 'Classic' },
  ];

  constructor() {}

  getAuthors(): Observable<Author[]> {
    return of([...this.authors]).pipe(delay(500));
  }

  getAuthorById(id: number): Observable<Author | undefined> {
    const author = this.authors.find((a) => a.id === id);
    return of(author).pipe(delay(500));
  }

  createAuthor(author: Omit<Author, 'id'>): Observable<Author> {
    const newId =
      this.authors.length > 0
        ? Math.max(...this.authors.map((a) => a.id || 0)) + 1
        : 1;
    const newAuthor = { ...author, id: newId } as Author;
    return of(newAuthor).pipe(
      delay(500),
      tap((a) => {
        this.authors = [a, ...this.authors];
      }),
    );
  }

  updateAuthor(author: Author): Observable<Author> {
    return of(author).pipe(
      delay(500),
      tap((updatedAuthor) => {
        const index = this.authors.findIndex((a) => a.id === updatedAuthor.id);
        if (index !== -1) {
          this.authors[index] = updatedAuthor;
        }
      }),
    );
  }

  deleteAuthor(id: number): Observable<void> {
    return of(undefined).pipe(
      delay(500),
      tap(() => {
        this.authors = this.authors.filter((a) => a.id !== id);
      }),
    );
  }
}
