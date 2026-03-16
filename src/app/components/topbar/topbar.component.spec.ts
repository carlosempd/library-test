import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TopbarComponent } from './topbar.component';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';
import { of } from 'rxjs';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    authorServiceSpy = jasmine.createSpyObj('AuthorService', ['resetData']);
    bookServiceSpy = jasmine.createSpyObj('BookService', ['resetData']);

    await TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      imports: [MatToolbarModule, MatIconModule, MatMenuModule],
      providers: [
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: BookService, useValue: bookServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidenav when onToggleSidenav is called', () => {
    spyOn(component.toggleSidenav, 'emit');
    component.onToggleSidenav();
    expect(component.toggleSidenav.emit).toHaveBeenCalled();
  });

  it('should call resetData on both services and reload window when logout is called', () => {
    spyOn(component, 'reloadPage');
    component.logout();

    expect(authorServiceSpy.resetData).toHaveBeenCalled();
    expect(bookServiceSpy.resetData).toHaveBeenCalled();
    expect(component.reloadPage).toHaveBeenCalled();
  });
});
