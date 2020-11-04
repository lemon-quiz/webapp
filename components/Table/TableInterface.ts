import {ReactNode} from "react";

type Printable = string | number | undefined | null;

export interface ColumnInterface<T = any> {
  align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  record?: T;
  column: string;
  label?: string;
  mapper?: (record: any) => Printable;
  searchable?: boolean;
  sortable?: boolean;
  children?: (value: any, record: any) => ReactNode;
}

export interface ColumnDateInterface extends ColumnInterface {
  locale?: string;
  format?: 'fromNow' | string;
}
