import { Component, OnInit } from '@angular/core';
import { BookService } from '@services/book.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  chartOptions: EChartsOption = {};

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooksChartData();
  }

  private loadBooksChartData() {
    this.bookService.getBooks().subscribe((books) => {
      const publishedBooks = books.filter((book) => book.published);

      const yearCounts: { [year: number]: number } = {};
      publishedBooks.forEach((book) => {
        const year = book.yearPublished;
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      });

      const sortedYears = Object.keys(yearCounts)
        .map(Number)
        .sort((a, b) => a - b);

      const data = sortedYears.map((year) => yearCounts[year]);

      this.initChart(sortedYears, data);
    });
  }

  private initChart(years: number[], data: number[]): void {
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: years.map(String),
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Books',
        minInterval: 1,
      },
      series: [
        {
          name: 'Books',
          type: 'bar',
          barWidth: '60%',
          data: data,
          itemStyle: {
            color: '#3f51b5',
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: '#303f9f',
            },
          },
        },
      ],
    };
  }
}
