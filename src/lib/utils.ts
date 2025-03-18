// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/table-core";
import {
  compareItems,
  rankItem,
  RankingInfo,
} from "@tanstack/match-sorter-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fuzzyFilter: FilterFn<unknown> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(row.getValue<string>(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  const metaA = rowA.columnFiltersMeta[columnId] as
    | { itemRank: RankingInfo }
    | undefined;
  const metaB = rowB.columnFiltersMeta[columnId] as
    | { itemRank: RankingInfo }
    | undefined;

  let dir = 0;

  if (metaA?.itemRank && metaB?.itemRank) {
    dir = compareItems(metaA.itemRank, metaB.itemRank);
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export type FuzzyFilter = typeof fuzzyFilter;
export type FuzzySort = typeof fuzzySort;
