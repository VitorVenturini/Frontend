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
import { useToast } from "@/components/ui/use-toast";
import { ActionsInteface } from "./ActionsContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useLanguage } from "@/components/language/LanguageContext"; // Importando o contexto de idioma
import texts from "@/_data/texts.json"; // Importando o arquivo de textos

interface DeleteActionsProps {
  id: string;
}

export default function DeleteActions({ id }: DeleteActionsProps) {
  const [actions] = useState<ActionsInteface[]>([]);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { language } = useLanguage(); // Usando o contexto de idioma

  const deleteActions = async (id: string) => {
    console.log(`Delete Actions id: ${id}`);
    wss?.sendMessage({
      api: "admin",
      mt: "DeleteActions",
      id: id,
    });
  };

  const handleDelete = () => {
    deleteActions(id);
    // toast({
    //   description: texts[language].actionDeletedSuccess, // Usando texto de tradução
    // });
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
          <AlertDialogTitle>
            {texts[language].labelAreYouSure} {/* Texto de tradução */}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {texts[language].labelActionWillBeDeleted} {/* Texto de tradução */}
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
