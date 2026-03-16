import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { Book } from '@models/book.model';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  const mockBooks: Book[] = [
    { id: 1, title: 'Book 1', authorId: 1, description: 'Desc 1', published: true, yearPublished: 2020, registeredAt: new Date() },
    { id: 2, title: 'Book 2', authorId: 2, description: 'Desc 2', published: false, registeredAt: new Date() } as any
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch books from assets if storage is empty', fakeAsync(() => {
    service.getBooks().subscribe(books => {
      expect(books.length).toBe(2);
      expect(books[0].title).toBe('Book 1');
    });

    const req = httpMock.expectOne('assets/data/books.json');
    req.flush(mockBooks);

    tick(500);
  }));

  it('should add a new book', fakeAsync(() => {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
    
    const newBook: Omit<Book, 'id'> = { 
      title: 'New Book', 
      authorId: 1, 
      description: 'New Desc', 
      published: true, 
      yearPublished: 2023 
    } as any;
    
    service.addBook(newBook).subscribe(book => {
      expect(book.id).toBe(3);
      expect(book.title).toBe('New Book');
      expect(book.registeredAt).toBeDefined();
    });

    tick(500);
    
    const stored = JSON.parse(localStorage.getItem('library_books') || '[]');
    expect(stored.length).toBe(3);
  }));

  it('should update a book', fakeAsync(() => {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
    
    const updatedBook: Book = { ...mockBooks[0], title: 'Updated Book Title' };
    
    service.updateBook(updatedBook).subscribe(book => {
      expect(book.title).toBe('Updated Book Title');
    });

    tick(500);
    
    const stored = JSON.parse(localStorage.getItem('library_books') || '[]');
    expect(stored.find((b: any) => b.id === 1).title).toBe('Updated Book Title');
  }));

  it('should delete a book', fakeAsync(() => {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
    
    service.deleteBook(1).subscribe(() => {
      const stored = JSON.parse(localStorage.getItem('library_books') || '[]');
      expect(stored.length).toBe(1);
    });

    tick(500);
  }));
});
