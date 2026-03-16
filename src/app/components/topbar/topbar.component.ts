import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <div class="toolbar-left">
        <button mat-icon-button (click)="onToggleSidenav()" class="toggle-button">
          <mat-icon>menu</mat-icon>
        </button>
        <img src="https://placehold.co/150x50?text=LOGO" alt="Logo" class="topbar-logo">
      </div>

      <span class="spacer"></span>

      <div class="user-info">
        <span class="username">John Doe</span>
        <img src="https://placehold.co/40x40?text=JD" alt="User Profile" class="profile-photo" [matMenuTriggerFor]="userMenu">
        
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      z-index: 2;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
    }

    .topbar-logo {
      height: 40px;
      margin-left: 10px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .username {
      margin-right: 15px;
      font-size: 14px;
    }

    .profile-photo {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 2px solid white;
    }

    @media (max-width: 768px) {
      .username {
        display: none;
      }
      .topbar-logo {
        height: 30px;
      }
    }
  `]
})
export class TopbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  logout() {
    console.log('Logging out...');
  }
}
