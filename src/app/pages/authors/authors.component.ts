import { Component, OnInit } from '@angular/core';
import { ColumnConfiguration, TableAction } from '@models/table.model';
import { Author } from '@models/author.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthorModalComponent } from './author-modal/author-modal.component';
import { ToastService } from '@app/services/toast.service';
import { AuthorService } from '@app/services/author.service';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  authors: Author[] = [];
  loading = false;

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private authorService: AuthorService,
  ) {}

  columns: ColumnConfiguration[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'genre', label: 'Genre', sortable: true },
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: 'edit', action: 'edit' },
    { label: 'Delete', icon: 'delete', action: 'delete', color: 'warn' },
  ];

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors() {
    this.loading = true;
    this.authorService.getAuthors().subscribe(
      (authors) => {
        this.authors = authors;
        this.loading = false;
      },
      (error) => {
        this.toast.error('Error loading authors');
        this.loading = false;
      },
    );
  }

  onActionClicked(event: { action: string; row: Author }) {
    if (event.action === 'edit') {
      this.openAuthorModal(event.row);
    } else if (event.action === 'delete') {
      this.deleteAuthor(event.row);
    }
  }

  deleteAuthor(author: Author) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Author',
        message: `Are you sure you want to delete ${author.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.authorService.deleteAuthor(author.id).subscribe(() => {
          this.authors = this.authors.filter((a) => a.id !== author.id);
          this.toast.success('Author deleted');
          this.loading = false;
        });
      }
    });
  }

  onNewAuthor() {
    this.openAuthorModal();
  }

  private openAuthorModal(author?: Author) {
    const dialogRef = this.dialog.open(AuthorModalComponent, {
      width: '450px',
      data: author,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        if (author) {
          // Update existing author
          this.authorService.updateAuthor({ ...author, ...result }).subscribe(
            (updatedAuthor) => {
              const index = this.authors.findIndex((a) => a.id === author.id);
              if (index !== -1) {
                this.authors[index] = updatedAuthor;
                this.authors = [...this.authors]; // Trigger change detection
                this.toast.success('Author updated');
              }
              this.loading = false;
            },
            () => {
              this.toast.error('Error updating author');
              this.loading = false;
            },
          );
        } else {
          // Add new author
          this.authorService.createAuthor(result).subscribe(
            (newAuthor) => {
              this.authors = [newAuthor, ...this.authors];
              this.toast.success('Author created');
              this.loading = false;
            },
            () => {
              this.toast.error('Error creating author');
              this.loading = false;
            },
          );
        }
      }
    });
  }
}
