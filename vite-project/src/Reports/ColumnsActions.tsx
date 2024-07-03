
import { Button } from "@/components/ui/button";
import DeleteActions from "@/components/actions/DeleteAction";

import {   ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Pencil } from "lucide-react"
import CardCreateAction from "@/components/actions/CardCreateAction";
import { ActionsInteface } from "@/components/actions/ActionsContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const columnsActions: ColumnDef<ActionsInteface>[] = [
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
            User
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
            Action Name 
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
        actions.action_user 
        return (
          <div className="flex justify-center gap-1 items-center">
            <Dialog>
              <DialogTrigger>
                <Pencil />
              </DialogTrigger>
              <DialogContent>
                 <CardCreateAction action={actions} isUpdate={true}/>
              </DialogContent>
            </Dialog>
            <DeleteActions id={actions.id} />
          </div>
        );
  
      },
    },
  ];