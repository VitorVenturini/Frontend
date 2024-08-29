"use client";
import DeleteUsers from "@/components/account/DeleteUsers";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserInterface } from "./UserContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Pencil } from "lucide-react";
import CardCreateAccount from "@/components/account/CardCreateAccount";
import { LogOut } from "lucide-react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
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
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const wss = useWebSocketData();
      const handleLogout = async (guid: string) => {
        wss?.sendMessage({
          api: "admin",
          mt: "DelConnUser",
          guid: guid,
        });
      };
      return (
        <div className="flex justify-start gap-1 items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button variant="ghost" size="icon">
                <Pencil />
              </Button>
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
          {user.status === "online" ? (
            <Button variant="ghost" size="icon">
              <AlertDialog>
                <AlertDialogTrigger>
                  <LogOut />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita.
                      Isso irá remover a conexão do usuário {user.name}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleLogout(user.guid)}>
                      Deslogar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-50 cursor-not-allowed"
              title="Usuário não logado"
            >
              <LogOut />
            </Button>
          )}
        </div>
      );
    },
  },
];
