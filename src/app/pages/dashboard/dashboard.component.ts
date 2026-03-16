import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <h1>Dashboard</h1>
      <p>Welcome to the Library Management System Dashboard.</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
  `]
})
export class DashboardComponent {}
