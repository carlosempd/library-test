import { Component } from '@angular/core';

@Component({
  selector: 'app-books',
  template: `
    <div class="page-container">
      <h1>Books</h1>
      <p>Manage library books here.</p>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 20px;
      }
    `,
  ],
})
export class BooksComponent {}
