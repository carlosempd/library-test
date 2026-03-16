import { Component, OnInit } from '@angular/core';
import { ColumnConfiguration, TableAction } from '@models/table.model';
import { Author } from '@models/author.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthorModalComponent } from './author-modal/author-modal.component';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  authors: Author[] = [];

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
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
    // Mock data
    this.authors = [
      { id: 1, name: 'Gabriel García Márquez', genre: 'Realismo Mágico' },
      { id: 2, name: 'Isabel Allende', genre: 'Realismo Mágico' },
      { id: 3, name: 'Jorge Luis Borges', genre: 'Realismo Mágico' },
      { id: 4, name: 'Julio Cortázar', genre: 'Realismo Mágico' },
      { id: 5, name: 'Mario Vargas Llosa', genre: 'Realismo Mágico' },
      { id: 6, name: 'Pablo Neruda', genre: 'Realismo Mágico' },
      { id: 7, name: 'Octavio Paz', genre: 'Realismo Mágico' },
      { id: 8, name: 'Carlos Fuentes', genre: 'Realismo Mágico' },
    ];
  }

  onActionClicked(event: { action: string; row: Author }) {
    if (event.action === 'edit') {
      this.openAuthorModal(event.row);
    } else if (event.action === 'delete') {
      this.authors = this.authors.filter((a) => a.id !== event.row.id);
      this.toast.success('Author deleted');
    }
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
        if (author) {
          // Update existing author
          const index = this.authors.findIndex((a) => a.id === author.id);
          if (index !== -1) {
            this.authors[index] = result;
            this.authors = [...this.authors]; // Trigger change detection
            this.toast.success('Author updated');
          }
        } else {
          // Add new author - PREPEND to the list
          const newId =
            this.authors.length > 0
              ? Math.max(...this.authors.map((a) => a.id || 0)) + 1
              : 1;
          this.authors = [{ ...result, id: newId }, ...this.authors];
          this.toast.success('Author created');
        }
      }
    });
  }
}
