import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthorService } from './author.service';
import { Author } from '@models/author.model';

describe('AuthorService', () => {
  let service: AuthorService;
  let httpMock: HttpTestingController;

  const mockAuthors: Author[] = [
    { id: 1, name: 'Author 1', genre: 'Fiction' },
    { id: 2, name: 'Author 2', genre: 'Fiction' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorService],
    });
    service = TestBed.inject(AuthorService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch authors from assets and save to storage if storage is empty', fakeAsync(() => {
    service.getAuthors().subscribe((authors) => {
      expect(authors.length).toBe(2);
      expect(authors).toEqual(mockAuthors);
    });

    const req = httpMock.expectOne('assets/data/authors.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockAuthors);

    tick(500);
  }));

  it('should get authors from localStorage if available', fakeAsync(() => {
    localStorage.setItem('library_authors', JSON.stringify(mockAuthors));

    service.getAuthors().subscribe((authors) => {
      expect(authors.length).toBe(2);
      expect(authors).toEqual(mockAuthors);
    });

    httpMock.expectNone('assets/data/authors.json');
    tick(500);
  }));

  it('should create a new author', fakeAsync(() => {
    localStorage.setItem('library_authors', JSON.stringify(mockAuthors));

    const newAuthor: Omit<Author, 'id'> = {
      name: 'New Author',
      genre: 'Fiction',
    };

    service.createAuthor(newAuthor).subscribe((author) => {
      expect(author.id).toBe(3);
      expect(author.name).toBe('New Author');
    });

    tick(500);

    const stored = JSON.parse(localStorage.getItem('library_authors') || '[]');
    expect(stored.length).toBe(3);
    expect(stored[0].name).toBe('New Author');
  }));

  it('should update an existing author', fakeAsync(() => {
    localStorage.setItem('library_authors', JSON.stringify(mockAuthors));

    const updatedAuthor: Author = { ...mockAuthors[0], name: 'Updated Name' };

    service.updateAuthor(updatedAuthor).subscribe((author) => {
      expect(author.name).toBe('Updated Name');
    });

    tick(500);

    const stored = JSON.parse(localStorage.getItem('library_authors') || '[]');
    expect(stored.find((a: any) => a.id === 1).name).toBe('Updated Name');
  }));

  it('should delete an author', fakeAsync(() => {
    localStorage.setItem('library_authors', JSON.stringify(mockAuthors));

    service.deleteAuthor(1).subscribe(() => {
      const stored = JSON.parse(
        localStorage.getItem('library_authors') || '[]',
      );
      expect(stored.length).toBe(1);
      expect(stored.find((a: any) => a.id === 1)).toBeUndefined();
    });

    tick(500);
  }));
});
