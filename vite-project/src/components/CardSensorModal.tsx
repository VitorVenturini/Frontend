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
import { useWebSocketData } from "./WebSocketProvider";
import { ButtonInterface } from "./ButtonsContext";
import { useSensors } from "./SensorContext";

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

export default function CardSensorModal({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
}: ButtonProps) {
  const [nameSensor, setNameSensor] = useState(
    existingButton?.button_prt || ""
  );
  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [typeMeasure, setTypeMeasure] = useState(
    existingButton?.sensor_type || ""
  );
  const [maxValue, setMaxValue] = useState(
    existingButton?.sensor_max_threshold || ""
  );
  const [minValue, setMinValue] = useState(
    existingButton?.sensor_min_threshold || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { sensors } = useSensors();
  const wss = useWebSocketData();

  const handleNameSensor = (value: string) => {
    setNameSensor(value);
  };

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    setNameButton(event.target.value);
  };
  const handleTypeMeasure = (value: string) => {
    setTypeMeasure(value);
  };
  const handleMaxValue = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxValue(event.target.value);
  };
  const handleMinValue = (event: ChangeEvent<HTMLInputElement>) => {
    setMinValue(event.target.value);
  };

  const handleCreateButton = () => {
    try {
      if (nameButton && typeMeasure && maxValue && minValue) {
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateSensorMessage" : "InsertSensorMessage",
          name: nameButton,
          value: nameSensor,
          guid: selectedUser?.guid,
          type: "sensor",
          min: minValue,
          max: maxValue,
          sensorType: typeMeasure,
          page: selectedPage,
          x: clickedPosition?.j,
          y: clickedPosition?.i,
        };
        wss?.sendMessage(message);
        setIsCreating(false);
      } else {
        toast({
          variant: "destructive",
          description:
            "Por favor, preencha todos os campos antes de criar o sensor.",
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
        // verificar com danilo possivel erro no backend
        //parseInt(existingButton?.id ?? "")
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Card className="border-none bg-transparent">
        <CardHeader>
          <CardTitle>
            {isUpdate ? "Atualização" : "Criação"} de Sensores
          </CardTitle>
          <CardDescription>
            Para {isUpdate ? "atualizar" : "criar"} um sensor complete os campos
            abaixo
            <p>
              Posição X {clickedPosition?.i}
              Posição Y {clickedPosition?.j}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Selecione o Sensor
            </Label>
            <Select value={nameSensor} onValueChange={handleNameSensor}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um Sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sensores</SelectLabel>
                  {sensors.map((sensor) => (
                    <SelectItem
                      key={sensor.sensor_name}
                      value={sensor.sensor_name}
                    >
                      {sensor.sensor_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
            <Label className="text-end" htmlFor="framework" id="typeMeasure">
              Tipo de medida
            </Label>
            <Select value={typeMeasure} onValueChange={handleTypeMeasure}>
              <SelectTrigger className="col-span-3" id="SelectTypeMeasure">
                <SelectValue placeholder="Selecione o tipo de medida" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="co2">CO²</SelectItem>
                <SelectItem value="battery">Bateria</SelectItem>
                <SelectItem value="humidity">Umidade do ar</SelectItem>
                <SelectItem value="leak">Alagamento</SelectItem>
                <SelectItem value="temperature">Temperatura</SelectItem>
                <SelectItem value="light">Iluminação</SelectItem>
                <SelectItem value="pir">Presença (V/F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Valor Mínimo
            </Label>
            <Input
              className="col-span-3"
              id="minValue"
              placeholder="00"
              type="number"
              value={minValue}
              onChange={handleMinValue}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Valor Máximo
            </Label>
            <Input
              className="col-span-3"
              id="maxValue"
              placeholder="00"
              type="number"
              value={maxValue}
              onChange={handleMaxValue}
              required
            />
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
          )}
          {!isCreating && (
            <Button onClick={handleCreateButton}>
              {isUpdate ? "Atualizar" : "Criar"} Sensor
            </Button>
          )}
          {isCreating && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUpdate ? "Atualizar" : "Criar"} Sensor
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
