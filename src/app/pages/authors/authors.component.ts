import { Component } from '@angular/core';

@Component({
  selector: 'app-authors',
  template: `
    <div class="page-container">
      <h1>Authors</h1>
      <p>Manage library authors here.</p>
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
export class AuthorsComponent {}
