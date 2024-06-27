"use client";
import { Button } from "@/components/ui/button";
import DeleteActions from "@/components/actions/DeleteAction";
import UpdateActions from "@/components/actions/UpdateActions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Pencil } from "lucide-react";
export interface Actions {
  id: string;
  action_name: string;
  action_alarm_code: string;
  action_start_type: string;
  action_prt: string;
  action_user: string;
  action_type: string; // o ? significa que o valor nao precisa ser presente , se for nulo nao tem problema
  action_device?: string | null;
  action_sensor_name?: string | null;
  action_sensor_type?: string | null;
  createdAt: string;
  updatedAt: string;
}
export const columnsActions: ColumnDef<Actions>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "action_user",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User {/*Ajustar text*/}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "action_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Action Name {/*Ajustar text*/}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "action_start_type",
      header: "Parâmetro",
    },
    {
      accessorKey: "action_prt",
      header: "ação",
    },
    {
      accessorKey: "action_alarm_code",
      header: "Gatilho",
    },

    {
      accessorKey: "action_device",
      header: "Device",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const actions = row.original;
  
        return (
          <div className="flex justify-center gap-1 items-center">
            <UpdateActions action={actions}/>
            <DeleteActions id={actions.id}/>
          </div>
        );
      },
    },
  ];
  
  