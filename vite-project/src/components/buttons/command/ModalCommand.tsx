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
import { useSensors } from "@/components/sensor/SensorContext";

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

export default function ModalCommand({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose
}: ButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { sensors } = useSensors();

  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [nameCommand, setNameCommand] = useState(
    existingButton?.button_prt || ""
  );
  const [deviceEUID, setDeviceEUID] = useState(
    existingButton?.button_device || ""
    //  existingButton?.button_device ? sensors.filter((sensor) =>{
    //     return sensor.devEUI === existingButton?.button_device
    //   })[0].sensor_name : ""
  );

  const [typeMeasure, setTypeMeasure] = useState(
    existingButton?.sensor_type || ""
  );

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    setNameButton(event.target.value);
  };
  const handleNameCommand = (value: string) => {
    setNameCommand(value);
  };

  const handleDeviceIot = (value: string) => {
    setDeviceEUID(value);
  };

  const handleTypeMeasure = (value: string) => {
    setTypeMeasure(value);
  };

  const handleCreateButton = () => {
    try {
      if (nameButton && nameCommand && deviceEUID) {
        const sensorInfo = sensors.filter((sensor) => {
          return sensor.deveui === deviceEUID;
        })[0];
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateButton" : "InsertButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: nameCommand,
          guid: selectedUser?.guid,
          type: "command",
          device: sensorInfo.deveui,
          gateway_id: sensorInfo.gateway_id,
          img: sensorInfo.description,
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

  const IotControllers = sensors.filter((sensor) => {
    return sensor.description?.startsWith("UC")
  })
  const selectedSensor = sensors.filter((sensor) => {
    return sensor.deveui === deviceEUID;
  })[0];

  let commandParameters = selectedSensor ? selectedSensor.parameters : [];

  // manter parâmetros que contêm "out" no nome se a descrição do sensor começar com "UC"
  if (selectedSensor?.description?.startsWith("UC")) {
    commandParameters = commandParameters.filter(param => param.parameter.includes("out"));
  }

  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>
            {isUpdate ? "Atualização" : "Criação"} de Botões de Comando
          </CardTitle>
          <CardDescription>
            Para {isUpdate ? "atualizar" : "criar"} um botão de comando complete
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
          <Label className="text-end" htmlFor="buttonName">
            Selecione o Dispostivo
          </Label>
          <Select value={deviceEUID} onValueChange={handleDeviceIot}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione um Dispostivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Dispositivos</SelectLabel>
                {IotControllers.map((sensor) => (
                  <SelectItem
                    key={sensor.deveui}
                    value={sensor.deveui as string}
                  >
                    {sensor.sensor_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4 ">
          <div className="flex justify-end gap-1">
            <Label className="text-end" htmlFor="framework" id="typeMeasure">
              Tipo de medida
            </Label>
          </div>
          <Select
            value={nameCommand}
            onValueChange={handleNameCommand}
            disabled={!deviceEUID}
          >
            <SelectTrigger className="col-span-3" id="SelectTypeMeasure">
              <SelectValue placeholder="Selecione o tipo de medida" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Medidas</SelectLabel>
                {commandParameters.map((parameters, i) => (
                  <SelectItem key={i} value={parameters.parameter}>
                    {parameters.name}
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
                    permanentemente o botão de Comando.
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
