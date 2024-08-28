"use client";
import DeleteUsers from "@/components/account/DeleteUsers";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserInterface } from "@/components/users/UserContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Pencil } from "lucide-react";
import CardCreateAccount from "@/components/account/CardCreateAccount";
export const columnsUser: ColumnDef<UserInterface>[] = [
  {
    accessorKey: "id",
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
      );
    },
  },
  {
    accessorKey: "guid",
    header: "GUID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "sip",
    header: "SIP",
  },
  {
    id: "options",
    header: "Opções",
    cell: ({ row }) => {
      const user = row.original;
      console.log()

      const [isDialogOpen, setIsDialogOpen] = useState(false);
      return (
        <div className="flex justify-center gap-1 items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Pencil />
            </DialogTrigger>
            <DialogContent>
              <CardCreateAccount
                user={user}
                isUpdate={true}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
         <DeleteUsers id={user.id} />
        </div>
      );
    },
  },
];
