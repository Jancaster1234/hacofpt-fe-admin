// src/components/data-table/data-table-header.tsx
"use client";

import { flexRender, Header, Table } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowDownNarrowWideIcon,
  ArrowUpIcon,
  ArrowUpNarrowWideIcon,
  EyeOffIcon,
  FilterIcon,
  GripVerticalIcon,
  MoveLeftIcon,
  MoveRightIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { DataTableInputDate } from "@/components/data-table/data-table-input-date";
import { getCommonPinningStyles } from "@/lib/columns";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDataTableStore } from "@/store/dataTableStore";

export function DataTableHeader<T>({
  header,
  table,
}: {
  header: Header<T, unknown>;
  table: Table<T>;
}) {
  const { isSelecting } = useDataTableStore((state) => ({ ...state }));
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });
  const { column, isPlaceholder } = header;

  const pinStyle = getCommonPinningStyles(column);
  const combinedStyles: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...(pinStyle || {}),
    alignContent: "center",
  };

  if (isSelecting) {
    return (
      <TableHead
        style={combinedStyles}
        className={"text-slate-500 text-xs content-center"}
        colSpan={header.colSpan}
        ref={setNodeRef}
      >
        {flexRender(column.columnDef.header, header.getContext())}
      </TableHead>
    );
  }

  return (
    <TableHead
      className={
        "p-0 pl-1 border-r border-dashed border-slate-400 hover:border-r-0"
      }
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={combinedStyles}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className={"flex flex-row items-center space-x-1"}>
            {column.getIsPinned() === false ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <GripVerticalIcon
                    className="h-4 w-4 text-slate-500"
                    aria-hidden="false"
                    {...attributes}
                    {...listeners}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rearrange this column</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                {!isPlaceholder && column.getCanSort() ? (
                  <Button
                    asChild // Ensure this does not create a nested <button>
                    onClick={() => column.toggleSorting()}
                    aria-label={
                      column.getIsSorted() === "desc"
                        ? "Sorted descending. Click to sort ascending."
                        : column.getIsSorted() === "asc"
                        ? "Sorted ascending. Click to sort descending."
                        : "Not sorted. Click to sort ascending."
                    }
                    variant="ghost"
                    size="sm"
                    className="h-7 text-slate-500 data-[state=open]:bg-accent"
                  >
                    <span>
                      {" "}
                      {/* Ensures no nested button issue */}
                      {flexRender(column.columnDef.header, header.getContext())}
                      {column.getIsSorted() === "desc" ? (
                        <ArrowDownIcon
                          className="ml-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      ) : column.getIsSorted() === "asc" ? (
                        <ArrowUpIcon
                          className="ml-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      ) : (
                        <CaretSortIcon
                          className="ml-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Button>
                ) : (
                  <span>
                    {flexRender(column.columnDef.header, header.getContext())}
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort rows by this column</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <FilterPopover header={header} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter rows by this column</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                {column.getIsPinned() ? (
                  <PinOffIcon
                    className="h-4 w-4 text-slate-500"
                    onClick={() => column.pin(false)}
                  />
                ) : (
                  <PinIcon
                    className="h-4 w-4 text-slate-500"
                    onClick={() => column.pin("left")}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {column.getIsPinned()
                    ? "Unpin this column"
                    : "Pin this column"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {column.getIsPinned() ? (
            <ContextMenuItem inset onClick={() => column.pin(false)}>
              Unpin
              <ContextMenuShortcut>
                <PinOffIcon className={"w-4 h-4"} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          ) : null}
          {column.getIsPinned() ? null : (
            <ContextMenuItem inset onClick={() => column.pin("left")}>
              Pin Left
              <ContextMenuShortcut>
                <MoveLeftIcon className={"w-4 h-4"} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          {column.getIsPinned() ? null : (
            <ContextMenuItem inset onClick={() => column.pin("right")}>
              Pin Right
              <ContextMenuShortcut>
                <MoveRightIcon className={"w-4 h-4"} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          {column.getIsSorted() === "asc" ? null : (
            <ContextMenuItem inset onClick={() => column.toggleSorting(false)}>
              Sort Ascending
              <ContextMenuShortcut>
                <ArrowDownNarrowWideIcon className={"w-4 h-4"} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          {column.getIsSorted() === "desc" ? null : (
            <ContextMenuItem inset onClick={() => column.toggleSorting(true)}>
              Sort Descending
              <ContextMenuShortcut>
                <ArrowUpNarrowWideIcon className={"w-4 h-4"} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          {column.getIsSorted() === "asc" || column.getIsSorted() === "desc" ? (
            <ContextMenuItem inset onClick={() => column.clearSorting()}>
              Clear Sorting
              <ContextMenuShortcut>
                <CaretSortIcon className={"w-4 h-4"} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          ) : null}
          <ContextMenuSeparator />
          <ContextMenuItem inset onClick={() => column.toggleVisibility()}>
            Hide
            <ContextMenuShortcut>
              <EyeOffIcon className={"w-4 h-4"} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div
        {...{
          onDoubleClick: () => header.column.resetSize(),
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ltr ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`,
        }}
      />
    </TableHead>
  );
}

function FilterPopover<T>({ header }: { header: Header<T, unknown> }) {
  const { column } = header;
  const { filterVariant } = column.columnDef.meta ?? {};
  if (!column.getCanFilter()) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterIcon className="h-4 w-4 text-slate-500" />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-5">
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="font-medium text-sm leading-none">Column filter</p>
            <p className="text-xs text-muted-foreground">
              Filter will be applied to current column only.
            </p>
          </div>
          {header.column.getCanFilter() ? (
            filterVariant === "date" ? (
              <DataTableInputDate column={column} />
            ) : (
              <DataTableFilter column={column} />
            )
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
