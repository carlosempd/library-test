import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Book } from '@models/book.model';
import { Author } from '@models/author.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor() {}

  getBooksPerYearOptions(books: Book[]): EChartsOption {
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

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: sortedYears.map(String),
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
        },
      ],
    };
  }

  getBookRegisterControlOptions(data: [number, number][]): EChartsOption {
    return {
      title: {
        text: 'Book register control',
        left: 'left',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const date = new Date(params[0].value[0]);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}<br/>Registers: ${params[0].value[1].toLocaleString()}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        boundaryGap: false as any,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'] as any,
        name: 'Amount',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
            return value.toString();
          },
        },
      },
      series: [
        {
          name: 'New Registers',
          type: 'line',
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3f51b5' },
                { offset: 1, color: 'rgba(63, 81, 181, 0.1)' },
              ],
            },
          },
          itemStyle: {
            color: '#3f51b5',
          },
          data: data,
        },
      ],
      animationDuration: 300,
    };
  }

  getPublishedStatusOptions(books: Book[]): EChartsOption {
    const published = books.filter((b) => b.published).length;
    const notPublished = books.length - published;

    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: '0', left: 'center' },
      series: [
        {
          name: 'Publication Status',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: { show: false },
          data: [
            { value: published, name: 'Published', itemStyle: { color: '#4caf50' } },
            { value: notPublished, name: 'Not Published', itemStyle: { color: '#f44336' } },
          ],
        },
      ],
    };
  }

  getGenreOptions(books: Book[], authors: Author[]): EChartsOption {
    const genreCounts: { [genre: string]: number } = {};

    books.forEach((book) => {
      const author = authors.find((a) => a.id === book.authorId);
      if (author) {
        genreCounts[author.genre] = (genreCounts[author.genre] || 0) + 1;
      }
    });

    const data = Object.entries(genreCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: '0', left: 'center' },
      series: [
        {
          name: 'Books by Author Genre',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: { show: false },
          data: data,
        },
      ],
    };
  }
}
