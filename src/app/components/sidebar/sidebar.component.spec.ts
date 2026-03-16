import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [MatListModule, MatIconModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have links to Dashboard, Authors, and Books', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('a[mat-list-item]');
    expect(links.length).toBe(3);
    expect(links[0].getAttribute('routerLink')).toBe('/dashboard');
    expect(links[1].getAttribute('routerLink')).toBe('/authors');
    expect(links[2].getAttribute('routerLink')).toBe('/books');
  });
});
