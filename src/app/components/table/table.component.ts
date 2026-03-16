import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfiguration, TableAction } from '@models/table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: ColumnConfiguration[] = [];
  @Input() actions: TableAction[] = [];
  @Input() showFilter: boolean = true;
  @Input() filterPlaceholder: string = 'Filter';

  @Output() actionClicked = new EventEmitter<{ action: string; row: T }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  currentFilter: string = '';

  constructor() {}

  ngOnInit(): void {
    this.updateTable();
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
    this.currentFilter = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAction(action: string, row: T) {
    this.actionClicked.emit({ action, row });
  }
}
