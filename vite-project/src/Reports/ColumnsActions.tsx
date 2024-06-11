"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";

export interface Actions {
  id: number;
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
export const ColumnsActions: ColumnDef<Actions>[] = [
    {
      accessorKey: "guid",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name {/*Ajustar text*/}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    // {
    //   accessorKey: "action_start_type",
    //   header: "Parâmetro",
    // },
    // {
    //   accessorKey: "action_prt",
    //   header: "ação",
    // },
    // {
    //   accessorKey: "action_alarm_code",
    //   header: "Gatilho",
    // },
    // {
    //   accessorKey: "action_user",
    //   header: "Usuário",
    // },
    // {
    //   accessorKey: "action_device",
    //   header: "Device",
    // },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const actions = row.original;
  
    //     return (
    //       /*<div>
    //         <DeleteAction id={actions.id}/>
    //       </div>*/
    //       <div></div>
    //     );
    //   },
    // },
  ];
  