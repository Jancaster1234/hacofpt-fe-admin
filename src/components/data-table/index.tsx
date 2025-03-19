// src/components/data-table/index.tsx
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useDataTableStore } from "@/store/dataTableStore";
import * as React from "react";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { fuzzyFilter } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { DataTableInput } from "@/components/data-table/data-table-input";
import { DataTableExport } from "@/components/data-table/data-table-export";
import { DataTableColumnVisibility } from "@/components/data-table/data-table-column-visibility";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableBody } from "@/components/data-table/data-table-body";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableFloatingBar } from "@/components/data-table/data-table-floating-bar";
import { FilterFn } from "@tanstack/table-core";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { SlashIcon } from "lucide-react";
import { DataTableSelections } from "@/components/data-table/data-table-selections";
import _ from "lodash";
import { IAdvancedDataTable } from "@/interface/IDataTable";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableAddRow } from "@/components/data-table/data-table-add-row";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterVariant?: "text" | "range" | "select" | "date";
  }

  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export function AdvancedDataTable<T>({
  columns,
  data,
  id,
  ...props
}: IAdvancedDataTable<T>) {
  if (_.isEmpty(id.trim())) {
    throw new Error("AdvancedDataTable requires a unique `id` field.");
  }
  const { isSelecting, setExtraProps } = useDataTableStore((state) => state);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState({});
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((c) => c.id!)
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const internalColumns = useMemo(() => {
    return isSelecting
      ? columns
      : columns
          .filter((col) => col.id !== "select")
          .map((col) => ({ ...col, size: col.size ?? 200 }));
  }, [columns, isSelecting]);

  useEffect(() => {
    setExtraProps(
      props.exportProps,
      props.contextMenuProps,
      props.addDataProps,
      props.editDataProps,
      props.dataValidationProps
    );
  }, [
    props.exportProps,
    props.contextMenuProps,
    props.addDataProps,
    props.editDataProps,
    props.dataValidationProps,
    setExtraProps,
  ]);

  const table = useReactTable({
    data,
    columns: internalColumns,
    state: {
      columnFilters,
      columnOrder,
      columnVisibility,
      columnPinning,
      globalFilter,
      rowSelection,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    // globalFilterFn: "fuzzy",
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const isFiltered = columnFilters.length > 0 || globalFilter !== "";
  const isRowSelected =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  if (props?.isLoading) {
    return <DataTableSkeleton columnCount={5} />;
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className="rounded bg-white mb-12">
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"flex flex-row items-center"}>
            <DataTableInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg border border-block"
              placeholder="Filter anything..."
            />
          </div>
          <div className={"flex flex-row items-center"}>
            <DataTableAddRow />
            <DataTableSelections table={table} />
            <DataTableColumnVisibility table={table} />
            <SlashIcon className={"w-4 h-4 text-slate-500"} />
            {props?.exportProps && (
              <DataTableExport
                table={table}
                onUserExport={props.exportProps.onUserExport}
              />
            )}
          </div>
        </div>
        <div
          className={"border mt-2 rounded-lg p-1"}
          ref={tableContainerRef}
          style={{
            overflow: "auto",
            position: "relative",
            height: "unset",
          }}
        >
          <Table style={{ display: "grid", width: table.getCenterTotalSize() }}>
            <TableHeader
              style={{
                display: "grid",
                position: "sticky",
                top: "0px",
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  style={{ display: "flex", width: "100%" }}
                  key={headerGroup.id}
                >
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DataTableHeader
                        table={table}
                        key={header.id}
                        header={header}
                      />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableHeader>
            <DataTableBody
              table={table}
              columnOrder={columnOrder}
              onClick={props?.onRowClick}
            />
          </Table>
        </div>
        <div className="h-2" />
        <DataTablePagination table={table} />
      </div>
      {(isFiltered || isRowSelected) && (
        <DataTableFloatingBar<T>
          onUserExport={props.actionProps?.onUserExport}
          onDelete={props.actionProps?.onDelete}
          table={table}
        />
      )}
    </DndContext>
  );
}
