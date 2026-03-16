import { Component, OnInit } from '@angular/core';
import { AuthorService } from '@services/author.service';
import { BookService } from '@services/book.service';
import { DashboardService } from '@services/dashboard.service';
import { EChartsOption } from 'echarts';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  booksChartOptions: EChartsOption = {};
  comingSoonChartOptions: EChartsOption = {};
  publishedStatusChartOptions: EChartsOption = {};
  genreChartOptions: EChartsOption = {};

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    forkJoin({
      books: this.bookService.getBooks(),
      authors: this.authorService.getAuthors(),
    }).subscribe(({ books, authors }) => {
      this.booksChartOptions = this.dashboardService.getBooksPerYearOptions(books);
      this.comingSoonChartOptions = this.dashboardService.getComingSoonOptions();
      this.publishedStatusChartOptions = this.dashboardService.getPublishedStatusOptions(books);
      this.genreChartOptions = this.dashboardService.getGenreOptions(books, authors);
    });
  }
}
