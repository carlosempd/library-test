import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BookService } from '@services/book.service';
import { AuthorService } from '@services/author.service';
import { DashboardService } from '@services/dashboard.service';
import { of } from 'rxjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks']);
    authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors']);
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'getBooksPerYearOptions',
      'getBookRegisterControlOptions',
      'getPublishedStatusOptions',
      'getGenreOptions',
    ]);

    bookServiceSpy.getBooks.and.returnValue(of([]));
    authorServiceSpy.getAuthors.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
        MatCardModule,
      ],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
    expect(authorServiceSpy.getAuthors).toHaveBeenCalled();
    expect(dashboardServiceSpy.getBooksPerYearOptions).toHaveBeenCalled();
  });

  it('should generate initial history on init', () => {
    // Current registerHistory is pushed in ngOnInit which is called in beforeEach
    expect(component['registerHistory'].length).toBeGreaterThan(0);
    // half hour in 5 second intervals is 360 points
    expect(component['registerHistory'].length).toBeGreaterThanOrEqual(359);
    expect(component['registerHistory'].length).toBeLessThanOrEqual(361);
    expect(component.numberOfRegisters).toBeGreaterThan(0);
    expect(
      dashboardServiceSpy.getBookRegisterControlOptions,
    ).toHaveBeenCalled();
  });

  it('should update number of registers during live simulation', fakeAsync(() => {
    tick(5001); // Trigger first interval
    expect(component.numberOfRegisters).toBeGreaterThan(0);
    expect(
      dashboardServiceSpy.getBookRegisterControlOptions,
    ).toHaveBeenCalled();
    component.ngOnDestroy(); // Clean up interval
  }));
});
