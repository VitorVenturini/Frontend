"use client";
import UpdateUsers from "@/components/UpdateUsers";
import DeleteUsers from "@/components/DeleteUsers";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}

// const deleteUsers = async (id: string) => {
//   console.log(`id: ${id}`);
//   const formData = {
//     id: id,
//   };
//   try {
//     const response = await fetch("https://meet.wecom.com.br/api/deleteUser", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth": localStorage.getItem("token") || "",
//       },
//       body: JSON.stringify(formData),
//     });
//     const data: User[] = await response.json();
//     setUsers(data);
//   } catch (error) {
//     console.error(error);
//   }
// };
export const columns: ColumnDef<User>[] = [
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
          <UpdateUsers />
          <DeleteUsers />
        </div>
      );
    },
  },
  // Adicione aqui outras colunas conforme necessário
];
