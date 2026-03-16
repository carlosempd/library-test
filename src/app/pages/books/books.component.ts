import { Component, OnInit } from '@angular/core';
import { BookService } from '@services/book.service';
import { AuthorService } from '@services/author.service';
import { Book } from '@models/book.model';
import { Author } from '@models/author.model';
import { ColumnConfiguration, TableAction } from '@models/table.model';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BookModalComponent } from './book-modal/book-modal.component';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  authors: Author[] = [];
  loading = false;

  columns: ColumnConfiguration[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'yearPublished', label: 'Year Published', sortable: true },
    { key: 'authorName', label: 'Author', sortable: true },
    { key: 'published', label: 'Published', sortable: true },
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: 'edit', action: 'edit', color: 'primary' },
    { label: 'Delete', icon: 'delete', action: 'delete', color: 'warn' },
  ];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private dialog: MatDialog,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      books: this.bookService.getBooks(),
      authors: this.authorService.getAuthors(),
    }).subscribe(
      ({ books, authors }) => {
        this.authors = authors;
        const authorIds = new Set(authors.map((a) => a.id));

        // Filter books by existing authors and map author names
        this.books = books
          .filter((book) => authorIds.has(book.authorId))
          .map((book) => ({
            ...book,
            authorName:
              authors.find((a) => a.id === book.authorId)?.name || 'Unknown',
            published: book.published ? 'Yes' : 'No',
          }));

        this.filteredBooks = [...this.books];
        this.loading = false;
      },
      () => {
        this.toast.error('Error loading data');
        this.loading = false;
      },
    );
  }

  onAddBook(): void {
    this.openBookModal();
  }

  handleAction(event: { action: string; row: any }): void {
    switch (event.action) {
      case 'edit':
        this.onEditBook(event.row);
        break;
      case 'delete':
        this.onDeleteBook(event.row);
        break;
    }
  }

  private openBookModal(book?: Book): void {
    const dialogRef = this.dialog.open(BookModalComponent, {
      width: '600px',
      data: { book, authors: this.authors },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        if (book) {
          // Update
          const updatedBook = { ...book, ...result };
          this.bookService.updateBook(updatedBook).subscribe(
            () => {
              this.toast.success('Book updated successfully');
              this.loadData();
            },
            () => {
              this.toast.error('Error updating book');
              this.loading = false;
            },
          );
        } else {
          // Create
          this.bookService.addBook(result).subscribe(
            () => {
              this.toast.success('Book created successfully');
              this.loadData();
            },
            () => {
              this.toast.error('Error creating book');
              this.loading = false;
            },
          );
        }
      }
    });
  }

  onEditBook(book: Book): void {
    this.bookService.getBookById(book.id).subscribe((fullBook) => {
      if (fullBook) {
        this.openBookModal(fullBook);
      }
    });
  }

  onDeleteBook(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Book',
        message: `Are you sure you want to delete "${book.title}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.bookService.deleteBook(book.id).subscribe(
          () => {
            this.toast.success('Book deleted successfully');
            this.loadData();
          },
          () => {
            this.toast.error('Error deleting book');
            this.loading = false;
          },
        );
      }
    });
  }
}
