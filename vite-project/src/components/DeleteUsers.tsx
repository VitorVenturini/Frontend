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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Trash2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import React, { useEffect, useState, ChangeEvent, useContext } from "react";
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
  interface User {
    id: string;
    name: string;
    guid: string;
    email: string;
    sip: string;
    // Adicione aqui outros campos se necessário
  }
  export default function DeleteUsers (){
    const [users, setUsers] = useState<User[]>([]);
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
    return(
        <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="ghost" size="icon">
                <Trash2 size={23} />
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
                <AlertDialogAction>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
  }