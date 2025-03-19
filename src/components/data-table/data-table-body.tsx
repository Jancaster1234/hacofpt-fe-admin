// src/components/data-table/data-table-body.tsx
"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DataTableCell } from "@/components/data-table/data-table-cell";
import * as React from "react";
import { IDataTableBody } from "@/interface/IDataTable";
import { Row } from "@tanstack/table-core";

export function DataTableBody<T>(
  props: Omit<
    IDataTableBody<T>,
    | "virtualColumns"
    | "rowVirtualizer"
    | "virtualPaddingRight"
    | "virtualPaddingLeft"
  >
) {
  const { table, columnOrder, onClick } = props;
  const { rows } = table.getRowModel();

  return (
    <TableBody style={{ display: "grid" }}>
      {rows.map((row) => {
        const visibleCells = row.getVisibleCells();

        return (
          <TableRow
            onClick={() => onClick && onClick(row.original)}
            key={row.id}
            className={onClick ? "cursor-pointer" : ""}
            data-state={row.getIsSelected() && "selected"}
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            {visibleCells.map((cell) => (
              <SortableContext
                key={cell.id}
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                <DataTableCell cell={cell} key={cell.id} />
              </SortableContext>
            ))}
          </TableRow>
        );
      })}
      {rows.length === 0 && (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
