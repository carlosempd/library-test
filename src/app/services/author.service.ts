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
    { id: 6, name: 'Pablo Neruda', genre: 'Realismo Mágico' },
    { id: 7, name: 'Octavio Paz', genre: 'Realismo Mágico' },
    { id: 8, name: 'Carlos Fuentes', genre: 'Realismo Mágico' },
  ];

  constructor() {}

  getAuthors(): Observable<Author[]> {
    return of([...this.authors]).pipe(delay(800));
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
