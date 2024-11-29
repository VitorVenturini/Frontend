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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EyeIcon } from "lucide-react";
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
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { useSensors } from "../sensor/SensorContext";
import { useCameras } from "../cameras/CameraContext";

interface User {
  id: string;
  name: string;
  guid: string;
}

interface TableData {
  action_exec_user: string;
  create_user: string;
  action_start_prt: string;
  action_start_type: string;
  action_start_device: string;
  action_exec_type: string;
  action_exec_prt: string;
  action_exec_device: string;
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
  const { users } = useUsers();
  const { buttons } = useButtons();
  const { sensors } = useSensors();
  const { cameras } = useCameras();

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
            <Button>{texts[language].createAction}</Button>{" "}
            {/* Texto de tradução */}
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
                  if (cell.column.id === "action_start_type") {
                    const startType = (cell.row.original as TableData)
                      .action_start_type;
                    cellValue = startType
                      ? texts[language][startType]
                      : startType; // Texto de tradução
                  }
                  if (cell.column.id === "action_start_device") {
                    const startDevice = (cell.row.original as TableData)
                      .action_start_device;
                    if (startDevice != "") {
                      const dev = sensors.find((s) => s.deveui === startDevice);
                      if (dev) {
                        cellValue = dev.sensor_name;
                      } else {
                        const dev = cameras.find((c) => c.mac === startDevice);
                        cellValue = dev ? dev.nickname : startDevice;
                      }
                    } else {
                      cellValue = startDevice;
                    }
                  }
                  if (cell.column.id === "action_start_prt") {
                    const startPrt = (cell.row.original as TableData)
                      .action_start_prt;
                    if (startPrt.length > 20) {
                      // Função para cortar o texto em 50 caracteres no último espaço
                      const truncateText = (
                        text: string,
                        limit: number
                      ): string => {
                        if (text.length <= limit) return text;

                        const truncated = text.slice(0, limit);
                        const lastSpaceIndex = truncated.lastIndexOf(" ");
                        return lastSpaceIndex !== -1
                          ? truncated.slice(0, lastSpaceIndex) + " ..."
                          : truncated + " ...";
                      };

                      const truncatedPrt = truncateText(startPrt, 60);

                      // Renderizar o valor da célula com o texto truncado e o HoverCard
                      cellValue = (
                        <>
                          <span>{truncatedPrt}</span>
                          <HoverCard>
                            <HoverCardTrigger>
                              <Button size="icon" variant="ghost">
                                <EyeIcon />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <p>{startPrt}</p>
                            </HoverCardContent>
                          </HoverCard>
                        </>
                      );
                    } else {
                      cellValue = startPrt;
                    }
                  }

                  if (cell.column.id === "action_exec_user") {
                    const userId = (cell.row.original as TableData)
                      .action_exec_user;
                    const user = users.find((u) => u.guid === userId);
                    cellValue = user ? user.name : texts[language].unknownUser; // Texto de tradução
                  }
                  if (
                    (cell.row.original as TableData).action_exec_type ==
                      "command" &&
                    cell.column.id === "action_exec_device"
                  ) {
                    const execDevice = (cell.row.original as TableData)
                      .action_exec_device;
                    if (execDevice != "") {
                      const dev = sensors.find((s) => s.deveui === execDevice);
                      if (dev) {
                        cellValue = dev.sensor_name;
                      }
                    } else {
                      cellValue = execDevice;
                    }
                  }
                  if (cell.column.id === "create_user") {
                    const userId = (cell.row.original as TableData).create_user;
                    const user = users.find((u) => u.guid === userId);
                    cellValue = user ? user.name : texts[language].unknownUser; // Texto de tradução
                  }
                  if (cell.column.id === "action_exec_type") {
                    const execType = (cell.row.original as TableData)
                      .action_exec_type;
                    cellValue = execType ? texts[language][execType] : execType; // Texto de tradução
                  }
                  if (
                    (cell.row.original as TableData).action_exec_type ==
                      "button" &&
                    cell.column.id === "action_exec_prt"
                  ) {
                    const btnId = (cell.row.original as TableData)
                      .action_exec_prt;
                    const btn = buttons.find((b) => b.id == parseInt(btnId));
                    cellValue = btn ? btn.button_name : btnId; // Texto de tradução
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
                <h1 className="m-4">{texts[language].noResult}</h1>{" "}
                {/* Texto de tradução */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
