type Printable = string | number | undefined | null;

export interface ColumnInterface {
  align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  record?: any;
  column: string;
  label?: string;
  mapper?: (record: any) => Printable;
  searchable?: boolean;
  sortable?: boolean;
}

export interface ColumnDateInterface extends ColumnInterface {
  locale?: string;
  format?: 'fromNow' | string;
}
