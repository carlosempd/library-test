import { Component, OnInit } from '@angular/core';
import { ColumnConfiguration, TableAction } from '@models/table.model';
import { Author } from '@models/author.model';

@Component({
  selector: 'app-authors',
  template: `
    <div class="page-container">
      <div class="header-section">
        <h1>Authors</h1>
        <p>Manage library authors here.</p>
      </div>

      <app-table
        [data]="authors"
        [columns]="columns"
        [actions]="actions"
        filterPlaceholder="Search authors..."
        (actionClicked)="onActionClicked($event)"
      >
      </app-table>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 24px;
        background-color: #f0f2f5;
        min-height: calc(100vh - 64px);
      }
      .header-section {
        margin-bottom: 24px;
        h1 {
          margin: 0;
          color: #1a73e8;
          font-weight: 500;
        }
        p {
          color: #5f6368;
          margin-top: 4px;
        }
      }
    `,
  ],
})
export class AuthorsComponent implements OnInit {
  authors: Author[] = [];

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
    console.log(
      `Action: ${event.action} clicked for author: ${event.row.name}`,
    );
    alert(`Action: ${event.action} clicked for author: ${event.row.name}`);
  }
}
