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
import { useToast } from "../ui/use-toast";
import { useUsers } from "../user/UserContext";
  interface DeleteUsersProps {
    id: number;
  }
  export default function DeleteUsers({ id }: DeleteUsersProps){
    console.log("ID" + id)
    const {toast} = useToast()
    const {deleteUser} = useUsers()
  
      const deleteUsers = async (id: number) => {
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
          deleteUser(id) // deletar o usuario no contexto pelo ID do usuario deletado
        } catch (error) {
          console.error(error);
        }
      };

      const handleDelete = () => {
        deleteUsers(id);
        toast({
          description: "Conta deletada com sucesso",
        });
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
                <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
  }