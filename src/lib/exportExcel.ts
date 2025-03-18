// src/lib/exportExcel.ts
"use client";

import { Column } from "@tanstack/react-table";
import { utils, writeFile } from "xlsx";

/**
 * Transforms table data for Excel export, excluding specified columns.
 */
export function exportExcelData<T extends Record<string, any>>(
  rows: T[],
  columns: Column<T, unknown>[],
  excludeColumns: string[]
): Record<string, any>[] {
  const transformedData: Record<string, any>[] = [];
  const columnMapping: Record<string, string> = {};

  columns.forEach((col) => {
    const colId = col.id ?? col.columnDef.id;
    if (colId && !excludeColumns.includes(colId)) {
      columnMapping[colId] = String(col.columnDef.header ?? colId);
    }
  });

  rows.forEach((row) => {
    const formattedRow: Record<string, any> = {};
    Object.keys(row).forEach((key) => {
      if (columnMapping[key]) {
        formattedRow[columnMapping[key]] = row[key];
      }
    });
    transformedData.push(formattedRow);
  });

  return transformedData;
}

/**
 * Exports JSON data to an Excel file.
 */
export function exportExcel<T>(data: T[], exportFilename: string) {
  if (typeof window === "undefined") {
    console.error("exportExcel should only be used on the client side.");
    return;
  }

  try {
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, "Exported Data");
    writeFile(workbook, `${exportFilename}.xlsx`);
  } catch (error) {
    console.error("Excel export error:", error);
    alert("Failed to export Excel file. See console for details.");
  }
}
