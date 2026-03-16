import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TableComponent } from './table.component';
import { ColumnConfiguration, TableAction } from '@models/table.model';

describe('TableComponent', () => {
  let component: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;

  const mockData = [
    { id: 1, name: 'Item 1', type: 'A' },
    { id: 2, name: 'Item 2', type: 'B' }
  ];

  const mockColumns: ColumnConfiguration[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' }
  ];

  const mockActions: TableAction[] = [
    { label: 'Edit', action: 'edit', icon: 'edit' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.columns = mockColumns;
    component.actions = mockActions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of rows', () => {
    component.data = mockData;
    component.displayedColumns = ['name'];
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr.mat-row');
    expect(rows.length).toBe(2);
  });

  it('should display the correct columns', () => {
    expect(component.displayedColumns).toContain('id');
    expect(component.displayedColumns).toContain('name');
    expect(component.displayedColumns).toContain('actions');
  });

  it('should emit actionClicked on button click', () => {
    spyOn(component.actionClicked, 'emit');
    component.onAction('edit', mockData[0]);
    expect(component.actionClicked.emit).toHaveBeenCalledWith({ action: 'edit', row: mockData[0] });
  });

  it('should filter data through searchSubject', fakeAsync(() => {
    spyOn(component.filterChanged, 'emit');
    component.data = mockData;
    fixture.detectChanges();
    
    component.applyFilter({ target: { value: 'Item 1' } } as any);
    tick(500);
    
    expect(component.dataSource.filter).toBe('item 1');
    expect(component.filterChanged.emit).toHaveBeenCalledWith('Item 1');
  }));

  it('should update table when data changes via ngOnChanges', () => {
    const newData = [{ id: 3, name: 'Item 3', type: 'C' }];
    component.data = newData;
    component.ngOnChanges({
      data: {
        currentValue: newData,
        previousValue: mockData,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.dataSource.data).toEqual(newData);
  });
});
