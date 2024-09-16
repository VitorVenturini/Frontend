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
import { limitButtonName } from "@/components/utils/utilityFunctions";
import DraggableComboButtons from "@/components/buttons/combo/DraggableComboButtons";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import DroppableComboArea from "./DroppableComboArea";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isTouchDevice } from "@/components/utils/utilityFunctions";
interface ButtonProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
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
  onClose,
}: ButtonProps) {
  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [droppedButtons, setDroppedButtons] = useState<
  (ButtonInterface | null)[]
>([null, null, null, null]);


  const [combo1, setCombo1] = useState(existingButton?.button_type_1 || "");
  const [combo2, setCombo2] = useState(existingButton?.button_type_2 || "");
  const [combo3, setCombo3] = useState(existingButton?.button_type_3 || "");
  const [combo4, setCombo4] = useState(existingButton?.button_type_4 || "");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [selectedDropArea, setSelectedDropArea] = useState<string | null>(null);

  const { buttons } = useButtons();

  const [removedButtons, setRemovedButtons] = useState<ButtonInterface[]>([]);


  const handleButtonDrop = (button: ButtonInterface) => {
    setRemovedButtons((prev) => [...prev, button]);
  };

  const handleReturnButton = (button: ButtonInterface) => {
    setRemovedButtons((prev) => prev.filter((b) => b.id !== button.id));
  };

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };
  const handleCreateButton = () => {
    try {
      const filledCombos = [combo1, combo2, combo3, combo4].filter(
        Boolean
      ).length;

      if (nameButton && filledCombos >= 2) {
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
        onClose?.();
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
      onClose?.();
    } catch (e) {
      console.error(e);
    }
  };

  const updateCombos = (droppedButtons: (ButtonInterface | null)[]) => {
    setCombo1((droppedButtons[0]?.id as any) || "");
    setCombo2((droppedButtons[1]?.id as any) || "");
    setCombo3((droppedButtons[2]?.id as any) || "");
    setCombo4((droppedButtons[3]?.id as any) || "");
  };
  
  useEffect(() =>{
    setCombo1((droppedButtons[0]?.id as any) || "");
    setCombo2((droppedButtons[1]?.id as any) || "");
    setCombo3((droppedButtons[2]?.id as any) || "");
    setCombo4((droppedButtons[3]?.id as any) || "");
  },[droppedButtons])

  // Pega os botões já existentes, se houver, para carregar na área de drop
  const existingDroppedButtons = [
    buttons.find((btn) => String(btn.id) === existingButton?.button_type_1) ||
      null,
    buttons.find((btn) => String(btn.id) === existingButton?.button_type_2) ||
      null,
    buttons.find((btn) => String(btn.id) === existingButton?.button_type_3) ||
      null,
    buttons.find((btn) => String(btn.id) === existingButton?.button_type_4) ||
      null,
  ];

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <CardHeader>
        <CardTitle>
          {isUpdate ? "Atualização" : "Criação"} de Botões Combo
        </CardTitle>
        <CardDescription>
          Para {isUpdate ? "atualizar" : "criar"} um botão de combo complete os
          campos abaixo
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 py-1">
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
        <div className="flex gap-5">
          <DroppableComboArea
            onButtonDrop={handleButtonDrop}
            onReturnButton={handleReturnButton}
            updateCombos={updateCombos}
            existingDroppedButtons={existingDroppedButtons}
            isUpdate={isUpdate}
            onSelectDropArea={setSelectedDropArea}
            selectedArea={selectedDropArea} // área selecionada
            droppedButtons={droppedButtons}
            setDroppedButtons={setDroppedButtons}
          />
          <DraggableComboButtons
            selectedUser={selectedUser}
            onButtonDrop={handleButtonDrop}
            removedButtons={removedButtons}
            existingDroppedButtons={existingDroppedButtons}
            onReturnButton={handleReturnButton}
            selectedDropArea={selectedDropArea}
            setDroppedButtons={setDroppedButtons}
            droppedButtons={droppedButtons}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end w-full">
        {isUpdate && (
          <div className="flex w-full justify-between">
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
          </div>

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
    </DndProvider>
  );
}
