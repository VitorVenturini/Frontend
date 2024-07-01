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
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";
import { Loader2, Pencil } from "lucide-react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useSensors } from "@/components/sensor/SensorContext";
import { ActionsInteface } from "./ActionsContext";
interface User {
  id: string;
  name: string;
  guid: string;
}

interface UpdateActionsProps {
  action: ActionsInteface;
  isUpdate: boolean;
}

export default function CardCreateAction({
  action,
  isUpdate = false,
}: UpdateActionsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [actionName, setActionName] = useState(action?.action_name || "");
  const [actionType, setActionType] = useState(action?.action_type || "");
  const [actionParameter, setActionParameter] = useState(action?.action_alarm_code || "");
  const [type, setType] = useState(action?.action_start_type || "");
  const [actionValue, setActionValue] = useState(action?.action_prt || "");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [nameSensor, setNameSensor] = useState(
    action?.action_sensor_name || ""
  );
  const [typeMeasure, setTypeMeasure] = useState(
    action?.action_sensor_type || ""
  );
  const [deviceDest, setDeviceDest] = useState(action?.action_device || "");

  const wss = useWebSocketData();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { sensors } = useSensors();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://meet.wecom.com.br/api/listUsers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth": localStorage.getItem("token") || "",
            },
          }
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleActionName = (event: ChangeEvent<HTMLInputElement>) => {
    setActionName(event.target.value);
  };
  const handleActionType = (value: string) => {
    setActionType(value);
  };
  const handleParameterAction = (event: ChangeEvent<HTMLInputElement>) => {
    setActionParameter(event.target.value);
  };
  const handleType = (value: string) => {
    setType(value);
  };
  const handleActionValue = (event: ChangeEvent<HTMLInputElement>) => {
    setActionValue(event.target.value);
  };
  const handleNameSensor = (value: string) => {
    setNameSensor(value);
  };
  const handleTypeMeasure = (value: string) => {
    setTypeMeasure(value);
  };
  const handleUserSelect = (value: string) => {
    const user = users.find((user) => user.id === value);
    console.log(user);
    setSelectedUser(user || null);
  };
  const handleDeviceDest = (value: string) => {
    setDeviceDest(value);
  };

  const handleCreateAction = () => {
    console.log(
      `User: ${JSON.stringify(
        selectedUser
      )}, Action Name: ${actionName}, Action Type: ${actionType}, Parâmetro da Ação: ${actionParameter}, Valor da Ação: ${actionValue}, Tipo de Ação: ${type}`
    );
    if (
      selectedUser?.guid &&
      actionName &&
      actionType &&
      actionParameter &&
      actionValue &&
      type
    ) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateAction" : "InsertAction",
        ...(isUpdate && { id: action?.id }),
        name: actionName,
        alarm: actionParameter,
        start: actionType,
        value: actionValue,
        sip: selectedUser?.guid,
        type: type,
        device: deviceDest,
        sensorType: typeMeasure,
        sensorName: nameSensor,
      });
      setIsCreating(false);
      setActionName("");
      setActionParameter("");
      setActionValue("");
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes de criar o botão.",
      });
    }
  };
  const shouldRenderInput =
    actionType === "minValue" || actionType === "maxValue";
  const shouldRenderDevice = type === "number";
  const resetForm = () => {
    setActionName("");
    setActionParameter("");
    setActionValue("");
  };
  return (
    //div que contem os cards
    <div className="flex flex-col md:flex-row gap-5 justify-center">
      <Dialog onOpenChange={(isOpen) => !isOpen && !isUpdate && resetForm()}>
        <DialogTrigger>
          {!isUpdate ? <Button>Criar Ação</Button> : <Pencil />}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Action</DialogTitle>
            <DialogDescription>Create Action TEXT</DialogDescription>
          </DialogHeader>
          {/* Card de criação da ação */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome
              </Label>
              <Select onValueChange={handleUserSelect}>
                <SelectTrigger className="col-span-2">
                  <SelectValue
                    placeholder={texts[language].selectUserPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{texts[language].users}</SelectLabel>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome da ação
              </Label>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Nome da ação"
                type="text"
                value={actionName}
                onChange={handleActionName}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex justify-end gap-1">
                <Label
                  htmlFor="name"
                  title="Qual contexto irá executar essa ação"
                >
                  Tipo de Gatilho
                </Label>
                <Info className="size-[12px]" />
              </div>
              <Select onValueChange={handleActionType} value={actionType}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Selecione o Gatilho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gatilho</SelectLabel>
                    <SelectItem value="alarm">Alarme</SelectItem>
                    <SelectItem value="origemNumber">Número Origem</SelectItem>
                    <SelectItem value="destNumber">Número Destino</SelectItem>
                    <SelectItem value="minValue">
                      Sensor Valor Minímo
                    </SelectItem>
                    <SelectItem value="maxValue">
                      Sensor Valor Maxímo
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {shouldRenderInput && (
              <div className="gap-1">
                <div className="grid grid-cols-3 items-center gap-4 mb-4">
                  <div className="flex justify-end gap-1">
                    <Label
                      htmlFor="name"
                      title="Qual contexto irá executar essa ação"
                    >
                      Sensor
                    </Label>
                  </div>
                  <Select value={nameSensor} onValueChange={handleNameSensor}>
                    <SelectTrigger className="col-span-2">
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
                <div className="grid grid-cols-3 items-center gap-4">
                  <div className="flex justify-end gap-1">
                    <Label
                      className="text-end"
                      htmlFor="framework"
                      id="typeMeasure"
                    >
                      Tipo de medida
                    </Label>
                  </div>
                  <Select value={typeMeasure} onValueChange={handleTypeMeasure}>
                    <SelectTrigger
                      className="col-span-2"
                      id="SelectTypeMeasure"
                    >
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
                      <SelectItem value="pressure">Pressão</SelectItem>
                      <SelectItem value="tvoc">
                        Compostos Orgânicos Voláteis{" "}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex justify-end gap-1">
                <Label
                  htmlFor="name"
                  title="Qual será o valor que irá executar essa ação"
                >
                  Parâmetro Gatilho
                </Label>
                <Info className="size-[12px]" />
              </div>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Parâmetro Gatilho"
                type="text"
                value={actionParameter}
                onChange={handleParameterAction}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Tipo
              </Label>
              <Select onValueChange={handleType} value={type}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Selecione o Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gatilho</SelectLabel>
                    <SelectItem value="alarm">Alarme</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="button">Botão</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {shouldRenderDevice && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-end" htmlFor="paramDest">
                  Dispositivo
                </Label>
                <Select onValueChange={handleDeviceDest} value={deviceDest}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Softphone">Softphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex justify-end gap-1">
                <Label
                  htmlFor="name"
                  title="Para qual ramal ou ID do botão a ser chamado/alertado"
                >
                  Valor
                </Label>
                <Info className="size-[12px]" />
              </div>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Valor"
                type="text"
                value={actionValue}
                onChange={handleActionValue}
              />
            </div>

            <DialogClose className="flex justify-end">
              {!isCreating && (
                <Button onClick={handleCreateAction}>Criar Ação</Button>
              )}
              {isCreating && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criar Ação
                </Button>
              )}
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}