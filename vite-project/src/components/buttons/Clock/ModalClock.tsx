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
import { limitButtonName } from "@/components/utils/utilityFunctions";
import { UserInterface } from "@/components/users/usersCore/UserContext";

interface TimeZone {
    zoneName: string;
    // Adicione outras propriedades se necessário
  }

interface ButtonProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function ModalClock({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose,
}: ButtonProps) {
  const [numberAlarm, setNumberAlarm] = useState(
    existingButton?.button_prt || ""
  );
  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };
  const handleNumberAlarm = (event: ChangeEvent<HTMLInputElement>) => {
    setNumberAlarm(event.target.value);
  };

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key==json`);
        const data = await response.json();
        setTimeZones(data.zones as TimeZone[]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTimeZones();
  }, []);

  const handleTimeZoneChange = (value: string) => {
    setSelectedTimeZone(value);
  };

  const handleCreateButton = () => {
    try {
      if (nameButton && selectedTimeZone) {
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateButton" : "InsertButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: selectedTimeZone,
          guid: selectedUser?.guid,
          type: "clock",
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
  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>
            {isUpdate ? "Atualização" : "Criação"} de Botões de Relegio
          </CardTitle>
          <CardDescription>
            Para {isUpdate ? "atualizar" : "criar"} um botão de alarme complete
            os campos abaixo
          </CardDescription>
        </CardHeader>
      )}
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="timeZone">
            Fuso Horário
          </Label>
          <Select
            value={selectedTimeZone}
            onValueChange={handleTimeZoneChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um Fuso Horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fusos Horários</SelectLabel>
                {timeZones.map((tz, index) => (
                  <SelectItem key={index} value={tz.zoneName}>
                    {tz.zoneName}
                  </SelectItem>
                ))}
              </SelectGroup>
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
