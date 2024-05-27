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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";
import { Cookie, Loader2 } from "lucide-react";
import { useWebSocketData } from "./WebSocketProvider";

interface User {
    id: string;
    name: string;
    guid: string;
    // Adicione aqui outros campos se necessário
  }

interface ButtonProps {
    clickedPosition: { i: number; j: number } | null;
    selectedUser: User | null;
    selectedPage: string;
  }

export default function CardSensorModal({selectedUser, selectedPage , clickedPosition} : ButtonProps) {
  const [nameSensor, setNameSensor] = useState("");
  const [nameButton, setNameButton] = useState("");
  const [typeMeasure, setTypeMeasure] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [minValue, setMinValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData()

  const handleNameSensor = (event: ChangeEvent<HTMLInputElement>) => {
    setNameSensor(event.target.value);
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

  const handleCreateSensor = () => {
    try {
      if (nameButton && typeMeasure && maxValue && minValue) {
        setIsCreating(true); 
        wss?.sendMessage({
            api: "admin",
            mt: "InsertSensorMessage",
            name: nameButton,
            value: nameSensor,
            guid: selectedUser?.guid,
            type: "sensor",
            min: minValue,
            max: maxValue,
            sensorType: typeMeasure,
            page: selectedPage,
            x: clickedPosition?.j,
            y: clickedPosition?.i
        })
        setIsCreating(false)
      } else {
        toast({
            variant: "destructive",
            description: "Por favor, preencha todos os campos antes de criar o sensor.",
          });
      }
    } catch (e) {
        console.error(e)
    }
  };
  return (
    <>
      <Card className="border-none bg-transparent">
        <CardHeader>
          <CardTitle>Criação de Sensores</CardTitle>
          <CardDescription>
            Para cirar um sensor complete os campos abaixo
            <p>
            Posição X {clickedPosition?.i}
            Posição Y {clickedPosition?.j}
              </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-end" htmlFor="sensorName">
              Nome do Sensor
            </Label>
            <Input
              className="col-span-2"
              id="sensorName"
              placeholder="Nome do Sensor"
              value={nameSensor}
              onChange={handleNameSensor}
              required
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Nome do botão
            </Label>
            <Input
              className="col-span-2"
              id="buttonName"
              placeholder="Nome do botão"
              value={nameButton}
              onChange={handleNameButton}
              required
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-end" htmlFor="framework" id="typeMeasure">
              Tipo de medida
            </Label>
            <Select value={typeMeasure} onValueChange={handleTypeMeasure}>
              <SelectTrigger className="col-span-2" id="SelectTypeMeasure">
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
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Valor Mínimo
            </Label>
            <Input
              className="col-span-2"
              id="minValue"
              placeholder="00"
              type="number"
              value={minValue}
              onChange={handleMinValue}
              required
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Valor Máximo
            </Label>
            <Input
              className="col-span-2"
              id="maxValue"
              placeholder="00"
              type="number"
              value={maxValue}
              onChange={handleMaxValue}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {!isCreating && (
            <Button onClick={handleCreateSensor}>Criar Sensor</Button>
          )}
          {isCreating && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criar Sensor
            </Button> 
          )}
        </CardFooter>
      </Card>
      {/* <DialogTitle>Criar Sensor</DialogTitle>
          <DialogDescription>
            Detalhes específicos para a criação de Sensores.
          </DialogDescription>  */}
    </>
  );
}
