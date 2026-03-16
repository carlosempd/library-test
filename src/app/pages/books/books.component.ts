import { Component, OnInit } from '@angular/core';
import { BookService } from '@services/book.service';
import { AuthorService } from '@services/author.service';
import { Book } from '@models/book.model';
import { Author } from '@models/author.model';
import { ColumnConfiguration, TableAction } from '@models/table.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  authors: Author[] = [];

  columns: ColumnConfiguration[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'yearPublished', label: 'Year Published', sortable: true },
    { key: 'authorName', label: 'Author', sortable: true },
    { key: 'registeredAt', label: 'Registered', sortable: true },
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: 'edit', action: 'update', color: 'primary' },
    { label: 'Delete', icon: 'delete', action: 'delete', color: 'warn' },
  ];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      books: this.bookService.getBooks(),
      authors: this.authorService.getAuthors(),
    }).subscribe(({ books, authors }) => {
      this.authors = authors;
      const authorIds = new Set(authors.map((a) => a.id));

      // Filter books by existing authors and map author names
      this.books = books
        .filter((book) => authorIds.has(book.authorId))
        .map((book) => ({
          ...book,
          authorName:
            authors.find((a) => a.id === book.authorId)?.name || 'Unknown',
          registeredAt: new Date(book.registeredAt).toLocaleDateString(),
        }));

      this.filteredBooks = [...this.books];
    });
  }

  onAddBook(): void {
    console.log('Add new book clicked');
    // Implementation for create action will be done later
  }

  handleAction(event: { action: string; row: any }): void {
    switch (event.action) {
      case 'update':
        this.onUpdateBook(event.row);
        break;
      case 'delete':
        this.onDeleteBook(event.row);
        break;
    }
  }

  onUpdateBook(book: Book): void {
    console.log('Update book:', book);
    // Simulation of update
  }

  onDeleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
