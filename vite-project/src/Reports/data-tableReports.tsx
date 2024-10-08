import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Ajuste o caminho conforme necessário
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/components/users/usersCore/UserContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PdfProps } from "./ExportReports";
import { isBase64File } from "@/components/utils/utilityFunctions";
import { Image } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  filter: string;
}

export function DataTable<TData>({
  columns,
  data,
  filter,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { language } = useLanguage();
  const { users } = useUsers();
  const useFilter = filter;
  const table = useReactTable({
    data,
    columns: columns.map((column) => {
      // Verifica se a coluna é "msg" e modifica-a
      if ((column as any).accessorKey === "msg") {
        return {
          ...column,
          cell: ({ row }: { row: any }) => {
            const message = row.original.msg;
            const isBase64 = isBase64File(message); // Função que verifica se é Base64

            // Retorna o ícone de imagem se for Base64, senão retorna o conteúdo da mensagem
            return isBase64 ? (
              <Dialog>
                <DialogTrigger className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <Image size={16} style={{ marginRight: "5px" }} />
                    Imagem
                  </div>
                </DialogTrigger>
                <DialogContent className="">
                  <div>
                    <img src={message}/>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              message
            );
          },
        };
      }
      return column;
    }),
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
  const [selectedUser, setSelectedUser] = useState("");
  const handleUserSelect = (value: string) => {
    table.getColumn("guid")?.setFilterValue(value);
    setSelectedUser(value);
  };

  return (
    <div className="rounded-md w-full border">
      {useFilter !== "" && (
        <div className="flex grid-cols-3 items-center gap-4 p-4">
          <Label className="text-end" htmlFor="name">
            {useFilter}
          </Label>
          <Select
            onValueChange={handleUserSelect}
            value={(table.getColumn("guid")?.getFilterValue() as string) || ""}
          >
            <SelectTrigger className="col-span-1">
              <SelectValue
                placeholder={texts[language].selectUserPlaceholder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{texts[language].users}</SelectLabel>
                {users.map((user) => (
                  <SelectItem
                    key={user.guid}
                    value={
                      table.getColumn("from") || table.getColumn("number")
                        ? user.name
                        : user.guid
                    }
                  >
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
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
                {loading && (
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[20%]" />
                      <Skeleton className="h-4 w-[20%]" />
                      <Skeleton className="h-4 w-[20%]" />
                      <Skeleton className="h-4 w-[20%]" />
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
