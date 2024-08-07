import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { useButtons } from "@/components/buttons/buttonContext/ButtonsContext";

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
  onClose?: () => void;
}

export default function ModalCombo({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose
}: ButtonProps) {
  const { buttons } = useButtons();

  const userButtons = buttons.filter((btn) => {
    return btn.button_user === selectedUser?.guid;
  });

  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [combo1, setCombo1] = useState(existingButton?.button_type_1 || "");
  const [combo2, setCombo2] = useState(existingButton?.button_type_2 || "");
  const [combo3, setCombo3] = useState(existingButton?.button_type_3 || "");
  const [combo4, setCombo4] = useState(existingButton?.button_type_4 || "");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    setNameButton(event.target.value);
  };
  const handleCreateButton = () => {
    try {
      if (nameButton && combo1) {
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateComboButton" : "InsertComboButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: "",
          guid: selectedUser?.guid,
          type: "combo",
          type1: combo1,
          type2: combo2,
          type3: combo3,
          type4: combo4,
          device: "",
          page: selectedPage,
          x: clickedPosition?.j,
          y: clickedPosition?.i,
        };
        wss?.sendMessage(message);
        setIsCreating(false);
        onClose?.()
      } else {
        toast({
          variant: "destructive",
          description:
            "Por favor, preencha todos os campos antes de criar o botão.",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteButton = () => {
    try {
      wss?.sendMessage({
        api: "admin",
        mt: "DeleteButtons",
        id: existingButton?.id,
      });
      onClose?.()
    } catch (e) {
      console.error(e);
    }
  };

  const handleCombo1 = (value: string) => {
    setCombo1(value);
  };
  const handleCombo2 = (value: string) => {
    setCombo2(value);
  };
  const handleCombo3 = (value: string) => {
    setCombo3(value);
  };
  const handleCombo4 = (value: string) => {
    setCombo4(value);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>
          {isUpdate ? "Atualização" : "Criação"} de Botões Combo
        </CardTitle>
        <CardDescription>
          Para {isUpdate ? "atualizar" : "criar"} um botão de combo complete os
          campos abaixo
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
            Nome do botão
          </Label>
          <Input
            className="col-span-3"
            id="buttonName"
            placeholder="Nome do botão"
            value={nameButton}
            onChange={handleNameButton}
            required
          />
        </div>
        <div className="flex gap-4 items-center">
          <Label className="text-end" htmlFor="framework" id="typeButton">
            Combo 1
          </Label>
          <Select value={combo1} onValueChange={handleCombo1}>
            <SelectTrigger className="col-span-1" id="SelectTypeButton">
              <SelectValue placeholder="Selecione o Botão" />
            </SelectTrigger>
            <SelectContent position="popper">
              {userButtons.map((buttons) => (
                <SelectItem key={buttons.id} value={buttons.id as any}>
                  {buttons.button_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <Label className="text-end" htmlFor="framework" id="typeButton">
            Combo 2
          </Label>
          <Select value={combo2} onValueChange={handleCombo2}>
            <SelectTrigger className="col-span-1" id="SelectTypeButton">
              <SelectValue placeholder="Selecione o Botão" />
            </SelectTrigger>
            <SelectContent position="popper">
              {userButtons.map((buttons) => (
                <SelectItem key={buttons.id} value={buttons.id as any}>
                  {buttons.button_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <Label className="text-end" htmlFor="framework" id="typeButton">
            Combo 3
          </Label>
          <Select value={combo3} onValueChange={handleCombo3}>
            <SelectTrigger className="col-span-1" id="SelectTypeButton">
              <SelectValue placeholder="Selecione o Botão" />
            </SelectTrigger>
            <SelectContent position="popper">
              {userButtons.map((buttons) => (
                <SelectItem key={buttons.id} value={buttons.id as any}>
                  {buttons.button_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <Label className="text-end" htmlFor="framework" id="typeButton">
            Combo 4
          </Label>
          <Select value={combo4} onValueChange={handleCombo4}>
            <SelectTrigger className="col-span-1" id="SelectTypeButton">
              <SelectValue placeholder="Selecione o Botão" />
            </SelectTrigger>
            <SelectContent position="popper">
              {userButtons.map((buttons) => (
                <SelectItem key={buttons.id} value={buttons.id as any}>
                  {buttons.button_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isUpdate && (
          <Button variant="secondary">
            <AlertDialog>
              <AlertDialogTrigger>Excluir</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação nao pode ser desfeita. Isso irá deletar
                    permanentemente o botão de Alarme.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteButton}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Button>
        )}
        {!isCreating && (
          <Button onClick={handleCreateButton}>
            {isUpdate ? "Atualizar" : "Criar"} Botão
          </Button>
        )}
        {isCreating && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUpdate ? "Atualizar" : "Criar"} Botão
          </Button>
        )}
      </CardFooter>
    </>
  );
}
