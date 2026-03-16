import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorService } from '@services/author.service';
import { BookService } from '@services/book.service';
import { DashboardService } from '@services/dashboard.service';
import { EChartsOption } from 'echarts';
import { forkJoin, interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  booksChartOptions: EChartsOption = {};
  booksRegisterControlChartOptions: EChartsOption = {};
  publishedStatusChartOptions: EChartsOption = {};
  genreChartOptions: EChartsOption = {};

  numberOfRegisters: number = 0;
  private registerHistory: [number, number][] = [];
  private dataSubscription?: Subscription;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.startLiveSimulation();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private startLiveSimulation() {
    this.dataSubscription = interval(5000)
      .pipe(startWith(0))
      .subscribe(() => {
        const now = Date.now();
        const newRegisters =
          Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;

        this.registerHistory.push([now, newRegisters]);

        // Keep only data from the last 2 hours (2 * 60 * 60 * 1000 ms)
        const twoHoursAgo = now - 2 * 60 * 60 * 1000;
        this.registerHistory = this.registerHistory.filter(
          ([timestamp]) => timestamp >= twoHoursAgo,
        );

        this.numberOfRegisters = this.registerHistory.reduce(
          (sum, [_, count]) => sum + count,
          0,
        );

        this.booksRegisterControlChartOptions =
          this.dashboardService.getBookRegisterControlOptions(
            this.registerHistory,
          );
      });
  }

  private loadDashboardData() {
    forkJoin({
      books: this.bookService.getBooks(),
      authors: this.authorService.getAuthors(),
    }).subscribe(({ books, authors }) => {
      this.booksChartOptions =
        this.dashboardService.getBooksPerYearOptions(books);
      this.publishedStatusChartOptions =
        this.dashboardService.getPublishedStatusOptions(books);
      this.genreChartOptions = this.dashboardService.getGenreOptions(
        books,
        authors,
      );
    });
  }
}
