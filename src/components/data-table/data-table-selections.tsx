// src/components/data-table/data-table-selections.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ListChecksIcon, ListXIcon } from "lucide-react";
import { useDataTableStore } from "@/store/dataTableStore";

interface DataTableSelectionsProps {
  setRowSelection: (state: Record<string, boolean>) => void;
}

export function DataTableSelections({
  setRowSelection,
}: DataTableSelectionsProps) {
  const { toggleSelection, isSelecting } = useDataTableStore((state) => ({
    ...state,
  }));

  const onPress = () => {
    toggleSelection();
    setRowSelection({});
  };

  return (
    <Button
      onClick={onPress}
      aria-label="Toggle selection"
      variant="ghost"
      size="sm"
      className="ml-auto hidden h-8 lg:flex text-slate-500"
    >
      {isSelecting ? (
        <ListXIcon className="mr-2 size-4" />
      ) : (
        <ListChecksIcon className="mr-2 size-4" />
      )}
      {isSelecting ? "Reset Rows" : "Select Rows"}
    </Button>
  );
}
