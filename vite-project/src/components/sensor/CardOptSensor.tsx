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
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { Loader2, CircleAlert } from "lucide-react";
import { limitButtonName } from "../utils/utilityFunctions";
import { UserInterface } from "../users/usersCore/UserContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface OptSensorProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedOpt: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function CardOptSensor({
  clickedPosition,
  selectedUser,
  selectedOpt,
  existingButton,
  isUpdate = false,
  onClose,
}: OptSensorProps) {
  const [nameSensor, setNameSensor] = useState(
    existingButton?.button_prt || ""
  );
  const [nameOpt, setNameOpt] = useState(existingButton?.button_name || "");
  const [isCreating, setIsCreating] = useState(false);
  const { sensors } = useSensors();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { language } = useLanguage();

  const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = limitButtonName(event.target.value);
    setNameOpt(name);
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
      onClose?.();
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
  };
  return (
    <>
      <Card className="border-none bg-transparent">
        {isUpdate && (
          <CardHeader>
            <CardTitle>Atualizar Botão Sensor</CardTitle>
            <CardDescription>
              Escolha um nome para o botão (de preferencia relacionado ao local
              onde o sensor esta localizado) e escolha o Sensor que voce deseja
              visualizar as informações
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Nome do botão
            </Label>
            <Input
              className="col-span-2"
              id="buttonName"
              placeholder="Nome do botão"
              value={nameOpt}
              onChange={handleNameOpt}
              required
            />
            {nameOpt.trim() === "" && (
              <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                {texts[language].alarmNumberRequired}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Selecione o Sensor
            </Label>
            <Select value={nameSensor} onValueChange={handleNameSensor}>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Selecione um Sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sensores</SelectLabel>
                  {sensors.map((sensor) => (
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
            {nameSensor.trim() === "" && (
              <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                {texts[language].alarmNumberRequired}
              </div>
            )}
          </div>
        </CardContent>
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
            </div>
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
