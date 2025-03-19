// src/interface/IDataTable.ts
import { z } from "zod";
import { Cell, ColumnDef, type Table } from "@tanstack/react-table";
import {
  TDataTableAddDataProps,
  TDataTableContextMenuProps,
  TDataTableDataValidation,
  TDataTableEditDataProps,
  TDataTableExportProps,
} from "@/types/dataTable";
// Removed the Virtualizer import since we no longer need it

export interface IAdvancedDataTable<T> {
  id: string;
  columns: ColumnDef<T>[];
  data: T[];
  exportProps?: TDataTableExportProps;
  actionProps?: {
    onDelete?: (rows: T[]) => void;
    onUserExport?: (rows: T[]) => void;
  };
  addDataProps?: TDataTableAddDataProps<T>;
  editDataProps?: TDataTableEditDataProps<T>;
  contextMenuProps?: TDataTableContextMenuProps;
  onRowClick?: (prop: T) => void;
  isLoading?: boolean;
  dataValidationProps?: TDataTableDataValidation[];
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export interface IDataTableFloatingBar<T> {
  table: Table<T>;
  onUserExport?: (rows: T[]) => void;
  onDelete?: (rows: T[]) => void;
}

export interface IDataTableExport<T> {
  table: Table<T>;
  onUserExport?: (data: T[]) => void;
}

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export interface IDataTableCellEdit<T> {
  cell: Cell<T, unknown>;
}

// Updated IDataTableBody interface without virtualization properties
export interface IDataTableBody<T> {
  table: Table<T>;
  columnOrder: string[];
  onClick?: (prop: T) => void;
}
