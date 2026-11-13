import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { SkeletonLine } from "./Skeleton";
import { cn } from "../lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  sortKey?: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: PaginationProps;
  rowActions?: (row: T) => React.ReactNode;
  getRowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export function DataTable<T extends object>({
  columns,
  data,
  isLoading = false,
  emptyState,
  emptyTitle = "No results",
  emptyDescription = "No data available.",
  pagination,
  rowActions,
  getRowKey,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
}: DataTableProps<T>) {
  const skeletonRows = 6;

  return (
    // GLSI .card wrapper: 1px border, no radius
    <div className="overflow-hidden border border-[#e2e8f0] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            {/* GLSI .results-table th: dark brand fill, white text, uppercase, tracked */}
            <tr className="bg-[#193441]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-4 py-2.5 text-left text-[11px] font-semibold text-white uppercase tracking-[0.04em] whitespace-nowrap",
                    col.sortKey && onSort
                      ? "cursor-pointer select-none hover:bg-[#122830]"
                      : "",
                  )}
                  onClick={() => col.sortKey && onSort && onSort(col.sortKey)}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortKey && onSort && (
                      <span className="flex flex-col ml-0.5">
                        <ChevronUp
                          className={cn(
                            "h-3 w-3 -mb-1",
                            sortKey === col.sortKey && sortDir === "asc"
                              ? "text-[#c17f24]"
                              : "text-white/30",
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-3 w-3",
                            sortKey === col.sortKey && sortDir === "desc"
                              ? "text-[#c17f24]"
                              : "text-white/30",
                          )}
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions && (
                <th
                  scope="col"
                  className="px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase tracking-[0.04em]"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 1 ? "bg-[#f7f8fa]" : "bg-white"}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 border-b border-[#e2e8f0]"
                    >
                      <SkeletonLine />
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 border-b border-[#e2e8f0]">
                      <SkeletonLine width="w-16" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="px-4 py-14"
                >
                  {emptyState ?? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-10 h-10 bg-[#f7f8fa] border border-[#e2e8f0] flex items-center justify-center">
                        <Inbox className="h-5 w-5 text-[#718096]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#193441]">
                          {emptyTitle}
                        </p>
                        <p className="text-xs text-[#718096] mt-0.5">
                          {emptyDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const key = getRowKey ? getRowKey(row) : String(rowIdx);
                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      // GLSI: tr:hover td { background: #f0f4f7 }
                      "transition-colors duration-100 border-b border-[#e2e8f0]",
                      onRowClick ? "cursor-pointer" : "",
                      "hover:bg-[#f0f4f7]",
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-[13px] text-[#2d3748] whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row)
                          : String(
                              (row as Record<string, unknown>)[col.key] ?? "",
                            )}
                      </td>
                    ))}
                    {rowActions && (
                      <td
                        className="px-4 py-3 text-right text-[13px] whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {rowActions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — GLSI .pag-btn pattern: sharp, 1px border */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#e2e8f0] px-4 py-2.5 bg-[#f7f8fa]">
          <p className="text-[11px] text-[#718096]">
            Showing{" "}
            <span className="font-semibold text-[#193441]">
              {(pagination.page - 1) * pagination.pageSize + 1}
            </span>
            {" – "}
            <span className="font-semibold text-[#193441]">
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total,
              )}
            </span>
            {" of "}
            <span className="font-semibold text-[#193441]">
              {pagination.total}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              // GLSI .pag-btn: white bg, 1px border, no radius
              className="inline-flex items-center gap-1 border border-[#e2e8f0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#193441] hover:bg-[#e8f0f4] hover:border-[#193441] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="px-3 text-[11px] text-[#718096]">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="inline-flex items-center gap-1 border border-[#e2e8f0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#193441] hover:bg-[#e8f0f4] hover:border-[#193441] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
