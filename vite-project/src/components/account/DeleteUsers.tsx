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
import { useUsers } from "../users/usersCore/UserContext";
import { host } from "@/App";
import { useAccount } from "./AccountContext";
import { useLanguage } from "../language/LanguageContext";
import texts from "@/_data/texts.json"
interface DeleteUsersProps {
  id: number;
}
export default function DeleteUsers({ id }: DeleteUsersProps) {
  const { toast } = useToast();
  const {language} = useLanguage()
  const { deleteUser } = useUsers();
  const account = useAccount();
  const deleteUsers = async (id: number) => {
    const formData = {
      id: id,
    };
    try {
      const response = await fetch(`${host}/api/deleteUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": account.accessToken || "",
        },
        body: JSON.stringify(formData),
      });
      deleteUser(id); // deletar o usuario no contexto pelo ID do usuario deletado
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    deleteUsers(id);
    toast({
      description: texts[language].accountDeleted,
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon">
          <Trash2 size={23} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{texts[language].labelAreYouSure}</AlertDialogTitle>
          <AlertDialogDescription>
          {texts[language].labelUserWillBeDeleted}
      
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{texts[language].cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {texts[language].labelConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
