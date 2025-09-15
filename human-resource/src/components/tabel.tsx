"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import type {
  ColumnDef,
  Row,
  Table as ReactTable,
  //   PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineAdd,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import Link from "next/link";

// const defaultColumnSizing = {
//   size: 150,
//   minSize: 20,
//   maxSize: Number.MAX_SAFE_INTEGER,
// };
interface ReactTableProps<T extends object> {
  objectData: T[];
  columns: ColumnDef<T>[];
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
  //   pageIndex?: number;
  //   pageSize?: number;
  pageCount?: number;
  judul?: string;
  //   onPaginationChange?: (pagination: PaginationState) => void;
  className?: string;
  tambahLink?: string;
}

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

function Table<T extends object>({
  objectData,
  columns,
  renderSubComponent,
  //   pageIndex,
  //   pageSize,
  pageCount,
  //   onPaginationChange,
  judul,
  tambahLink,
}: // className,
ReactTableProps<T>) {
  //   const [pagination, setPagination] = useState<PaginationState>({
  //     pageIndex: pageIndex ?? 0,
  //     pageSize: pageSize ?? 5,
  //   });

  const [data, setData] = useState(() => [...objectData]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    pageCount,
    meta: {
      updateData: ({
        rowIndex,
        columnId,
        value,
      }: {
        rowIndex: number;
        columnId: string;
        value: string | number; // Anda bisa menyesuaikan ini berdasarkan tipe data yang lebih spesifik
      }) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    debugTable: true,
    // onPaginationChange: setPagination,
  });

  //   useEffect(() => {
  //     if (onPaginationChange) {
  //       onPaginationChange(pagination);
  //     }
  //   }, [pagination, onPaginationChange]);

  return (
    <div className="w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white py-4 space-y-4">
      <p className="border-b-[1px] border-b-gray-400 px-4 py-4 text-xl font-semibold">
        {judul}
      </p>
      <div className="flex justify-between px-4">
        <div className="flex space-x-1 items-center">
          <p>Tampilkan</p>
          <select
            className="border p-1 rounded w-14"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4 items-center">
          <Link
            className="bg-[#18529E] rounded-lg pr-2 text-white flex justify-around items-center py-1
              transition transform duration-300 ease-in-out hover:scale-100 active:scale-75"
            href={tambahLink ? tambahLink : ""}
          >
            <MdOutlineAdd className="text-2xl" />
            <p>Tambah</p>
          </Link>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="leading-snug border border-gray-300 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg"
              placeholder="Search all columns..."
              type=""
              name=""
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col py-2 px-1">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-1">
            <div className="overflow-hidden">
              <table className={`Table min-w-full`}>
                <thead className="bg-[#18529E] text-white">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      <th>Nomor</th>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-3 text-base font-semibold border-white border-[1px]"
                        >
                          {header.isPlaceholder ? null : (
                            <span
                              {...{
                                className:
                                  (header.column.getCanSort() &&
                                    header.id !== "Aksi") ||
                                  "Foto"
                                    ? "cursor-pointer select-none flex justify-center items-center"
                                    : "",
                                onClick:
                                  header.id === "Aksi" || header.id === "Foto"
                                    ? void 0
                                    : header.column.getToggleSortingHandler(),
                                disabled:
                                  header.id === "Aksi" || header.id === "Foto",
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <span
                                className={
                                  header.id === "Aksi" || header.id === "Foto"
                                    ? "hidden"
                                    : "relative w-7 h-7 text-gray-400"
                                }
                              >
                                <MdOutlineArrowDropUp
                                  className={`absolute text-xl top-0 ${
                                    header.column.getIsSorted() === "asc"
                                      ? "text-white "
                                      : "text-gray-400"
                                  }`}
                                />
                                <MdOutlineArrowDropDown
                                  className={`absolute text-xl bottom-0 ${
                                    header.column.getIsSorted() === "desc"
                                      ? "text-white "
                                      : "text-gray-400"
                                  }`}
                                />
                              </span>
                              {{
                                asc: "",
                                desc: "",
                              }[header.column.getIsSorted() as string] ?? null}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.map((row, index) => (
                    <Fragment key={row.id}>
                      <tr
                        className={`'bg-gray-50 transition-colors dark:bg-black-300 text-center
                                                ${row.getIsExpanded()}`}
                      >
                        <td
                          className={`w-fit text-sm text-gray-700 border-white border-[1px] text-center ${
                            Number(index) % 2 === 0
                              ? "bg-white "
                              : "bg-[#F8F8F8] "
                          }`}
                        >
                          {Number(row.id) + 1}
                        </td>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            className={`py-2 text-sm text-gray-700 border-white border-[1px] text-center  ${
                              Number(index) % 2 === 0
                                ? "bg-white "
                                : "bg-[#F8F8F8] "
                            }`}
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>

                      {renderSubComponent ? (
                        <tr key={row.id + "-expanded"}>
                          <td colSpan={columns.length}>
                            {renderSubComponent({ row })}
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-4" />
            <Pagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination<T>({
  table,
}: React.PropsWithChildren<{
  table: ReactTable<T>;
}>) {
  return (
    <div className="flex items-center justify-end px-4 space-x-4">
      <button
        className={`border rounded p-1 w-7 h-7 ${
          !table.getCanPreviousPage()
            ? "border-gray-400 text-gray-400"
            : "border-gray-600 "
        }`}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <MdKeyboardArrowLeft />
      </button>
      <button
        className={`border rounded p-1 w-7 h-7 ${
          table.getState().pagination.pageIndex === 0
            ? "border-gray-400 text-gray-400"
            : "border-gray-600 "
        }`}
        onClick={() => {
          table.getPageCount() <= 3
            ? table.setPageIndex(0)
            : table.setPageIndex(table.getState().pagination.pageIndex - 1);
        }}
        disabled={table.getState().pagination.pageIndex === 0}
      >
        {table.getPageCount() <= 3 && table.getState().pagination.pageIndex <= 3
          ? "1"
          : table.getState().pagination.pageIndex + 1}
      </button>

      <button
        className={`border rounded p-1 w-7 h-7 ${
          Number(table.getPageCount()) === 1
            ? "hidden"
            : table.getState().pagination.pageIndex != 1
            ? "border-gray-600 "
            : "border-gray-400 text-gray-400"
        }`}
        onClick={() => {
          table.getPageCount() <= 3
            ? table.setPageIndex(1)
            : table.setPageIndex(table.getState().pagination.pageIndex);
        }}
        disabled={table.getState().pagination.pageIndex === 1}
      >
        {table.getPageCount() <= 3
          ? "2"
          : table.getState().pagination.pageIndex + 1}
      </button>

      <button
        className={`border rounded p-1 w-7 h-7 ${
          Number(table.getPageCount()) <= 2
            ? "hidden"
            : table.getState().pagination.pageIndex + 1 === table.getPageCount()
            ? "border-gray-400 text-gray-400"
            : "border-gray-600 "
        }`}
        onClick={() => {
          table.setPageIndex(table.getState().pagination.pageIndex + 1);
        }}
        disabled={
          table.getPageCount() === table.getState().pagination.pageIndex + 1 ||
          table.getPageCount() <= 2
        }
      >
        {table.getPageCount() <= 3
          ? "3"
          : table.getState().pagination.pageIndex + 2}
      </button>

      <button
        className={`border rounded p-1 w-7 h-7 ${
          !table.getCanNextPage()
            ? "border-gray-400 text-gray-400"
            : "border-gray-600 "
        }`}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <MdKeyboardArrowRight />
      </button>
      <input
        type="number"
        defaultValue={table.getState().pagination.pageIndex + 1}
        min="1"
        max={table.getPageCount()}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          table.setPageIndex(page);
        }}
        className="border p-1 rounded w-16"
      />
    </div>
  );
}

export default Table;
