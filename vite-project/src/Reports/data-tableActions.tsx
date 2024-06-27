"use client";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import CardCreateAction from "@/components/actions/CardCreateAction";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [data]);
  return (
    <div className="rounded-md w-full border">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Filter User..."
          value={
            (table.getColumn("action_user")?.getFilterValue() as string) || ""
          }
          onChange={(event) =>
            table.getColumn("action_user")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CardCreateAction />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loading == true && (
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[20px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[20px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[20px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[20px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[20px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                )}
                <h1 className="m-4">No Result</h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}