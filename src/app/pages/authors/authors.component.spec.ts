import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorsComponent } from './authors.component';
import { AuthorService } from '@app/services/author.service';
import { ToastService } from '@app/services/toast.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthorsComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors', 'deleteAuthor', 'updateAuthor', 'createAuthor']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    authorServiceSpy.getAuthors.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [AuthorsComponent],
      imports: [MatDialogModule, MatIconModule, MatButtonModule],
      providers: [
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load authors on init', () => {
    expect(authorServiceSpy.getAuthors).toHaveBeenCalled();
  });

  it('should open modal for new author', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);
    component.onNewAuthor();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should delete author when confirmed', () => {
    const mockAuthor = { id: 1, name: 'Test' } as any;
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);
    authorServiceSpy.deleteAuthor.and.returnValue(of(undefined));

    component.deleteAuthor(mockAuthor);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(authorServiceSpy.deleteAuthor).toHaveBeenCalledWith(1);
    expect(toastServiceSpy.success).toHaveBeenCalledWith('Author deleted');
  });
});
