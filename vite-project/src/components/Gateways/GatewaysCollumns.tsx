import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Pencil } from "lucide-react";
import { TableProperties } from 'lucide-react';
import CardCreateGateway from "./CardCreateGateway";
import { GatewaysInterface } from "./GatewaysContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import DeleteGateways from "./DeleteGateway";
import Devices from "./Devices";

export const gatewaysCollumns: ColumnDef<GatewaysInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nickname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apelido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "host",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Host / IP
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "userapi",
    header: "Usuário de Acesso",
  },
  {
    accessorKey: "updatedAt",
    header: "Ultima alteração",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const gateways = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      return (
        <div className="flex justify-center gap-1 items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button variant="ghost" size="icon">
              <Pencil />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <CardCreateGateway
                gateway={gateways}
                isUpdate={true}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <DeleteGateways id={gateways.id}/>
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost" size="icon">
              <TableProperties  />
              </Button>
            </DialogTrigger>
            <DialogContent >
              <Devices />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
