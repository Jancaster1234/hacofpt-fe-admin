// src/store/dataTableStore.ts
"use client";

import { createContext, useContext } from "react";
import { createStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

import {
  TDataTableAddDataProps,
  TDataTableContextMenuProps,
  TDataTableDataValidation,
  TDataTableEditDataProps,
  TDataTableExportProps,
} from "@/types/dataTable";

export interface IDataTableStore {
  isSelecting: boolean;
  exportProps?: TDataTableExportProps;
  contextMenuProps?: TDataTableContextMenuProps;
  addDataProps?: TDataTableAddDataProps<any>;
  editDataProps?: TDataTableEditDataProps<any>;
  dataValidationProps?: TDataTableDataValidation[];
}

const getDefaultState = (): IDataTableStore => ({
  isSelecting: false,
  exportProps: undefined,
  contextMenuProps: undefined,
  addDataProps: undefined,
  editDataProps: undefined,
  dataValidationProps: [],
});

export const createDataTableStore = (
  preloadedState: Partial<IDataTableStore> = {}
) => {
  return createStore<
    IDataTableStore & {
      toggleSelection: () => void;
      setExtraProps: (
        exportProps?: TDataTableExportProps,
        contextMenuProps?: TDataTableContextMenuProps,
        addDataProps?: TDataTableAddDataProps<any>,
        editDataProps?: TDataTableEditDataProps<any>,
        dataValidationProps?: TDataTableDataValidation[]
      ) => void;
    }
  >((set) => ({
    ...getDefaultState(),
    ...preloadedState,
    toggleSelection: () =>
      set((state) => ({ isSelecting: !state.isSelecting })),
    setExtraProps: (
      exportProps,
      contextMenuProps,
      addDataProps,
      editDataProps,
      dataValidationProps
    ) => {
      set(() => ({
        exportProps,
        contextMenuProps,
        addDataProps,
        editDataProps,
        dataValidationProps: dataValidationProps ?? [],
      }));
    },
  }));
};

export type DataTableStoreType = ReturnType<typeof createDataTableStore>;
type DataTableStoreInterface = ReturnType<DataTableStoreType["getState"]>;

const DataTableContext = createContext<DataTableStoreType | null>(null);
export const DataTableProvider = DataTableContext.Provider;

export const useDataTableStore = <T>(
  selector: (state: DataTableStoreInterface) => T
) => {
  const store = useContext(DataTableContext);
  if (!store) {
    throw new Error("DataTableStore is missing the provider");
  }
  return useStoreWithEqualityFn(store, selector);
};
