import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfiguration, TableAction } from '@models/table.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges, OnDestroy {
  @Input() data: T[] = [];
  @Input() columns: ColumnConfiguration[] = [];
  @Input() actions: TableAction[] = [];
  @Input() showFilter: boolean = true;
  @Input() filterPlaceholder: string = 'Filter';

  @Output() actionClicked = new EventEmitter<{ action: string; row: T }>();
  @Output() filterChanged = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  currentFilter: string = '';

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.updateTable();

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filterValue) => {
        this.executeFilter(filterValue);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns'] || changes['actions']) {
      this.updateTable();
    }
  }

  private updateTable(): void {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns.map((c) => c.key);

    if (this.actions && this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  private executeFilter(filterValue: string) {
    this.currentFilter = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.filterChanged.emit(filterValue);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onAction(action: string, row: T) {
    this.actionClicked.emit({ action, row });
  }
}
