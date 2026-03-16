export interface ColumnConfiguration {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  color?: string;
}
