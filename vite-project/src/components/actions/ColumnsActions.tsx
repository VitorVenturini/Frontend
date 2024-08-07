import { Button } from "@/components/ui/button";
import DeleteActions from "@/components/actions/DeleteAction";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Pencil } from "lucide-react";
import CardCreateAction from "@/components/actions/CardCreateAction";
import { ActionsInteface } from "@/components/actions/ActionsContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useUsers } from "@/components/user/UserContext";
import { MessageCircleWarning } from "lucide-react";
import NotifyActions from "@/components/actions/CardNotificationAction";

export const columnsActions: ColumnDef<ActionsInteface>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "create_user",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ultimo editou
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      }
    },
    {
      accessorKey: "action_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome da Ação
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "action_start_prt",
      header: "Parâmetro Entrada",
    },
    {
      accessorKey: "action_start_type",
      header: "Gatilho",
    },
    {
      accessorKey: "action_start_device_parameter",
      header: "Device Parâmetro",
    },
    {
      accessorKey: "action_start_device",
      header: "Entry IoT Device",
    },
    {
      accessorKey: "action_exec_user",
      header: "Usuário ",
    },
    {
      accessorKey: "action_exec_device",
      header: "Out IoT Device",
    },
    {
      accessorKey: "action_exec_prt",
      header: "Device Parameter",
    },
    {
      accessorKey: "action_exec_type_command_mode",
      header: "Command",
    },
    {
      accessorKey: "createdAt",
      header: "Criado Em",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {

        const actions = row.original;
        const [isDialogOpen, setIsDialogOpen] = useState(false); 

      return (
        <div className="flex justify-center gap-2 items-center">
          <NotifyActions id={actions.id}/>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Pencil />
              
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <CardCreateAction
                action={actions}
                isUpdate={true}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <DeleteActions id={actions.id} />
        </div>
      );
    },
  },
];
