import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, map, switchMap } from 'rxjs/operators';
import { Author } from '@models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private authors: Author[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) {}

  private ensureDataLoaded(): Observable<Author[]> {
    if (this.dataLoaded) {
      return of(this.authors);
    }
    return this.http.get<Author[]>('assets/data/authors.json').pipe(
      tap((data) => {
        this.authors = data;
        this.dataLoaded = true;
      }),
    );
  }

  getAuthors(): Observable<Author[]> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      map((authors) => [...authors]),
    );
  }

  getAuthorById(id: number): Observable<Author | undefined> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      map(() => this.authors.find((a) => a.id === id)),
    );
  }

  createAuthor(author: Omit<Author, 'id'>): Observable<Author> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      map(() => {
        const newId =
          this.authors.length > 0
            ? Math.max(...this.authors.map((a) => a.id || 0)) + 1
            : 1;
        const newAuthor = { ...author, id: newId } as Author;
        this.authors = [newAuthor, ...this.authors];
        return newAuthor;
      }),
    );
  }

  updateAuthor(author: Author): Observable<Author> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      tap(() => {
        const index = this.authors.findIndex((a) => a.id === author.id);
        if (index !== -1) {
          this.authors[index] = author;
        }
      }),
      map(() => author),
    );
  }

  deleteAuthor(id: number): Observable<void> {
    return this.ensureDataLoaded().pipe(
      delay(500),
      tap(() => {
        this.authors = this.authors.filter((a) => a.id !== id);
      }),
      map(() => undefined),
    );
  }
}
