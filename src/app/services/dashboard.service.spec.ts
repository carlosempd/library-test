import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { Book } from '@models/book.model';
import { Author } from '@models/author.model';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockBooks: Book[] = [
    { id: 1, title: 'Book 1', authorId: 1, description: 'D1', published: true, yearPublished: 2020, registeredAt: new Date() },
    { id: 2, title: 'Book 2', authorId: 2, description: 'D2', published: true, yearPublished: 2020, registeredAt: new Date() },
    { id: 3, title: 'Book 3', authorId: 1, description: 'D3', published: false, registeredAt: new Date() } as any
  ];

  const mockAuthors: Author[] = [
    { id: 1, name: 'Author 1', birthDate: new Date() as any, genre: 'Fiction' },
    { id: 2, name: 'Author 2', birthDate: new Date() as any, genre: 'Action' }
  ] as any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate Books Per Year chart options', () => {
    const options = service.getBooksPerYearOptions(mockBooks);
    expect(options.xAxis).toBeDefined();
    expect((options.xAxis as any).data).toContain('2020');
    expect((options.series as any)[0].data).toContain(2);
  });

  it('should generate Publication Status chart options', () => {
    const options = service.getPublishedStatusOptions(mockBooks);
    const seriesData = (options.series as any)[0].data;
    expect(seriesData.find((d: any) => d.name === 'Published').value).toBe(2);
    expect(seriesData.find((d: any) => d.name === 'Not Published').value).toBe(1);
  });

  it('should generate Genre chart options', () => {
    const options = service.getGenreOptions(mockBooks, mockAuthors);
    const seriesData = (options.series as any)[0].data;
    expect(seriesData.find((d: any) => d.name === 'Fiction').value).toBe(2); // Book 1 and Book 3
    expect(seriesData.find((d: any) => d.name === 'Action').value).toBe(1); // Book 2
  });

  it('should generate Book Register Control chart options', () => {
    const mockData: [number, number][] = [[Date.now(), 5000]];
    const options = service.getBookRegisterControlOptions(mockData);
    expect(options.title).toBeDefined();
    expect((options.title as any).text).toBe('Book register control');
  });
});
