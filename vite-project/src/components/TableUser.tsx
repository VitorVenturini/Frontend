import React, { useEffect, useState, ChangeEvent } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}

export default function TableUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [id, setId] = useState("");

  const handleIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };

  const listUsers = async () => {
    try {
      const response = await fetch("https://meet.wecom.com.br/api/listUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteUsers = async (id: string) => {
    console.log(`id: ${id}`);
    const formData = {
      id: id,
    };
    try {
      const response = await fetch("https://meet.wecom.com.br/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">SIP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(users) &&
          users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">{user.sip}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive" size="icon">
                      <Trash2 size={24} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ao apertar em confirmar este usuário será deletado
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          await deleteUsers(user.id);
                          // Atualize a lista de usuários após a exclusão
                          listUsers();
                        }}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
