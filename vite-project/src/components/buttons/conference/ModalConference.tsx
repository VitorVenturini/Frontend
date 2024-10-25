import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CircleAlert, Group } from "lucide-react";

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
import {
  Megaphone,
  Home,
  Zap,
  Waves,
  User,
  Phone,
  Hospital,
  Flame,
  Siren,
} from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsersPbx } from "@/components/users/usersPbx/UsersPbxContext";
import { limitButtonName } from "@/components/utils/utilityFunctions";
import { UserInterface } from "@/components/users/usersCore/UserContext";

interface ButtonConferenceProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function ModalConference({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  onClose,
  isUpdate = false,
}: ButtonConferenceProps) {
  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [paramButton, setParamButton] = useState(
    existingButton?.button_prt || ""
  );
  const [deviceButton, setDeviceButton] = useState(
    existingButton?.button_device || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { usersPbx } = useUsersPbx();

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };
  const handleParamButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamButton(event.target.value);
  };

  const handleDeviceButton = (value: string) => {
    setDeviceButton(value);
  };

  const filteredDevices = usersPbx?.filter((u) => {
    return u.guid === selectedUser?.sip;
  })[0];

  const handleCreateDest = () => {
    if (nameButton && paramButton && deviceButton) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateButton" : "InsertButton",
        ...(isUpdate && { id: existingButton?.id }),
        name: nameButton,
        value: paramButton,
        guid: selectedUser?.guid,
        type: "conference",
        device: deviceButton,
        page: selectedPage,
        x: clickedPosition?.j,
        y: clickedPosition?.i,
      });
      onClose?.();
      setIsCreating(false);
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes de criar o botão.",
      });
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
    // setNameDest("");
    // setParamDest("");
    // setIconDest("");
    // setDeviceDest("");
    // setIsCreating(false);
    // setIsUpdate(false);
  };
  const iconSize = 18;
  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>
            {isUpdate ? "Atualização" : "Criação"} de Botões de Conferência
          </CardTitle>
          <CardDescription>
            Para {isUpdate ? "atualizar" : "criar"} um botão de conferência complete
            os campos abaixo
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-6 grid-rows-3 gap-4 py-4">
          <div className="flex align-middle justify-end items-center">
            <Label className="text-end" htmlFor="destName">
              Nome do Botão
            </Label>
          </div>
          <div className="col-span-2">
            <Input
              className="col-span-4"
              id="destName"
              placeholder="Nome do Botão"
              value={nameButton}
              onChange={handleNameButton}
              required
            />
          </div>
          <div className="col-start-4">
           
            {nameButton.trim() === "" && (
              <div className="text-[10px] text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                Campo obrigatório
              </div>
            )}
          </div>
          <div className="col-start-1 row-start-2 align-middle flex justify-end items-center">
         
            <Label className="text-end" htmlFor="paramDest">
              Número
            </Label>
          </div>
          <div className="col-span-2 col-start-2 row-start-2">
        
            <Input
              className="col-span-4"
              id="paramDest"
              placeholder="Número"
              value={paramButton}
              onChange={handleParamButton}
              required
            />
          </div>
          <div className="col-start-4 row-start-2">
          
            {paramButton.trim() === "" && (
              <div className="text-[10px] text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                Campo obrigatório
              </div>
            )}
          </div>
          <div className="col-start-1 row-start-3 align-middle flex justify-end items-center">
         
            <Label className="text-end" htmlFor="paramDest">
              Dispositivo
            </Label>
          </div>
          <div className="col-span-2 col-start-2 row-start-3">
         
            <Select value={deviceButton} onValueChange={handleDeviceButton}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Dispositivos</SelectLabel>
                  {filteredDevices?.devices?.map((dev, index) => (
                    <SelectItem key={index} value={dev.hw as string}>
                      {dev.text}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-start-4 row-start-3">
  
            {deviceButton.trim() === "" && (
              <div className="text-[10px] text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                Campo obrigatório
              </div>
            )}
          </div>
        </div>

        <CardFooter className="flex justify-end w-full">
          {isUpdate && (
            <div className="flex w-full justify-between">
              <Button variant="secondary">
                <AlertDialog>
                  <AlertDialogTrigger className="w-full h-full">
                    Excluir
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso irá deletar
                        permanentemente o botão Sensor.
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
            <Button onClick={handleCreateDest}>
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
      </CardContent>
    </>
  );
}
