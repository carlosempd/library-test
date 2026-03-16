import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksComponent } from './books.component';
import { BookService } from '@services/book.service';
import { AuthorService } from '@services/author.service';
import { ToastService } from '@services/toast.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'updateBook', 'addBook', 'deleteBook', 'getBookById']);
    authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    bookServiceSpy.getBooks.and.returnValue(of([]));
    authorServiceSpy.getAuthors.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
    expect(authorServiceSpy.getAuthors).toHaveBeenCalled();
  });

  it('should filter books by existing authors', () => {
    const mockBooks = [{ id: 1, authorId: 1, title: 'B1' }, { id: 2, authorId: 2, title: 'B2' }];
    const mockAuthors = [{ id: 1, name: 'A1' }];
    
    bookServiceSpy.getBooks.and.returnValue(of(mockBooks as any));
    authorServiceSpy.getAuthors.and.returnValue(of(mockAuthors as any));

    component.loadData();

    expect(component.books.length).toBe(1);
    expect(component.books[0].authorName).toBe('A1');
  });

  it('should open confirmation dialog on delete', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
    component.onDeleteBook({ id: 1, title: 'Test' } as any);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
