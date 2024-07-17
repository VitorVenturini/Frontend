"use client";
import UpdateUsers from "@/components/account/UpdateUsers";
import DeleteUsers from "@/components/account/DeleteUsers";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
export interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
}

export const columnsUser: ColumnDef<User>[] = [
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
      )
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div>
          <UpdateUsers user={user}/>
          <DeleteUsers id={user.id}/>
        </div>
      );
    },
  },
];
