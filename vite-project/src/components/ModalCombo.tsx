import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "./LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
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
import React, { useEffect, useState, ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { useWebSocketData } from "./WebSocketProvider";
import { ButtonInterface } from "./ButtonsContext";

interface User {
  id: string;
  name: string;
  guid: string;
}

interface ButtonProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
}

export default function ModalCombo({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
}: ButtonProps) {
  const language = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();

  return (
    <>
      <DialogTitle>Criar Combo</DialogTitle>
      <DialogDescription>
        Detalhes específicos para a criação de Combos.
        <p>
          Posição Y {clickedPosition?.j}
          Posição X {clickedPosition?.i}
        </p>
      </DialogDescription>
    </>
  );
}
