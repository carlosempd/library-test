import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon>dashboard</mat-icon>
        <span class="nav-label">Dashboard</span>
      </a>
      <a mat-list-item routerLink="/authors" routerLinkActive="active-link">
        <mat-icon>people</mat-icon>
        <span class="nav-label">Authors</span>
      </a>
      <a mat-list-item routerLink="/books" routerLinkActive="active-link">
        <mat-icon>book</mat-icon>
        <span class="nav-label">Books</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    .nav-label {
      margin-left: 10px;
    }

    .active-link {
      background-color: rgba(0, 0, 0, 0.05);
      color: #3f51b5;
      font-weight: bold;
    }
  `]
})
export class SidebarComponent {}
