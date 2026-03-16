import { Component, EventEmitter, Output } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private authorService: AuthorService,
    private bookService: BookService,
  ) {}

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  logout() {
    console.log('Logging out and resetting data...');
    this.authorService.resetData();
    this.bookService.resetData();
    this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }
}
