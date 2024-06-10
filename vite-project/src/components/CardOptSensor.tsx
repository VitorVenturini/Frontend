import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSensors } from "./SensorContext";
import { useWebSocketData } from "./WebSocketProvider";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
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
import { ButtonInterface } from "./ButtonsContext";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface OptSensorProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedOpt: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
}

export default function CardOptSensor({
  clickedPosition,
  selectedUser,
  selectedOpt,
  existingButton,
  isUpdate = false,
}: OptSensorProps) {
  const [nameSensor, setNameSensor] = useState(
    existingButton?.button_prt || ""
  );
  const [nameOpt, setNameOpt] = useState(existingButton?.button_name || "");
  const [isCreating, setIsCreating] = useState(false);
  const { sensors } = useSensors();
  const { toast } = useToast();
  const wss = useWebSocketData();

  const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameOpt(event.target.value);
  };
  const handleNameSensor = (value: string) => {
    setNameSensor(value);
  };

  const handleCreateOpt = () => {
    if (nameOpt && nameSensor) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateButton" : "InsertButton",
        ...(isUpdate && { id: existingButton?.id }),
        name: nameOpt,
        value: nameSensor,
        guid: selectedUser?.guid,
        img: null,
        type: selectedOpt,
        page: "0",
        x: clickedPosition?.j,
        y: clickedPosition?.i,
      });
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
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Card className="border-none bg-transparent">
        <CardHeader>
          <CardTitle>{isUpdate ? "Atualizar" : "Criar"} Botão Sensor</CardTitle>
          <CardDescription>
            Escolha um nome para o botão (de preferencia relacionado ao local
            onde o sensor esta localizado) e escolha o Sensor que voce deseja
            visualizar as informações
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
              value={nameOpt}
              onChange={handleNameOpt}
              required
            />
          </div>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          {isUpdate && (
            <Button variant="secondary">
              <AlertDialog>
                <AlertDialogTrigger className="w-full h-full">
                  Excluir
                </AlertDialogTrigger>
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
            <Button onClick={handleCreateOpt}>
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
      </Card>
    </>
  );
}
