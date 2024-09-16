"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useUsers } from "@/components/users/usersCore/UserContext";
import LogoCore from "@/assets/Vector.svg";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext"; // Importação do contexto de idioma

interface User {
  id: string;
  name: string;
  guid: string;
}

interface TableData {
  action_exec_user: string; 
  create_user: string; 
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends TableData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { language } = useLanguage(); // Acessando o idioma
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const {users} = useUsers();
  
  const handleRowClick = () => {
    console.log("Linha Clicada");
  };

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
          placeholder={texts[language].filterUser} // Usando o texto de tradução
          value={
            (table.getColumn("create_user")?.getFilterValue() as string) || ""
          }
          onChange={(event) =>
            table.getColumn("create_user")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button>{texts[language].createAction}</Button> {/* Texto de tradução */}
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <CardCreateAction onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
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
                {row.getVisibleCells().map((cell) => {
                  let cellValue = flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  );
                  if (cell.column.id === "action_exec_user") {
                    const userId = (cell.row.original as TableData).action_exec_user;
                    const user = users.find((u) => u.guid === userId);
                    cellValue = user ? user.name : texts[language].unknownUser; // Texto de tradução
                  }
                  if (cell.column.id === "create_user") {
                    const userId = (cell.row.original as TableData).create_user;
                    const user = users.find((u) => u.guid === userId);
                    cellValue = user ? user.name : texts[language].unknownUser; // Texto de tradução
                  }
                  return <TableCell key={cell.id}>{cellValue}</TableCell>;
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loading && (
                  <div className="flex w-full justify-center">
                    <img src={LogoCore} className="p-6 h-64 animate-spin" />
                  </div>
                )}
                <h1 className="m-4">{texts[language].noResult}</h1> {/* Texto de tradução */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
