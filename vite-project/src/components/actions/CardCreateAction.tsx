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
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
interface User {
  id: string;
  name: string;
  guid: string;
}

interface UpdateActionsProps {
  action?: ActionsInteface;
  isUpdate?: boolean;
}

export default function CardCreateAction({
  action,
  isUpdate = false,
}: UpdateActionsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [buttonSelect] = useState("");

  const [actionName, setActionName] = useState(action?.action_name || "");
  const [actionStartType, setActionType] = useState(
    action?.action_start_type || ""
  );
  const [actionStartParameter, setActionParameter] = useState(
    action?.action_start_prt || ""
  );
  const [actionExecType, setType] = useState(action?.action_exec_type || "");
  const [actionExecValue, setActionValue] = useState(""); //SEM USO NO MOMENTO
  const [selectedUser, setSelectedUser] = useState(
    action?.action_exec_user || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  const [actionSensorName, setNameSensor] = useState(
    action?.action_sensor_name || ""
  );
  const [actionSensorParameter, setStartDevice] = useState(
    action?.action_sensor_parameter || ""
  );
  const [actionExecDevice, setActionExecDevice] = useState(
    action?.action_exec_device || ""
  );
  const [actionExecPrt, setActionExecPrt] = useState(
    action?.action_exec_prt || ""
  );

  const [deviceDest, setDeviceDest] = useState(
    action?.action_exec_device || ""
  );
  const [actionExecTypeCommandMode, setActionExecTypeCommandMode] = useState(
    action?.action_exec_type_command_mode || ""
  );

  const wss = useWebSocketData();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { sensors } = useSensors();
  const { buttons } = useButtons();

  console.log("Botões na action", buttons);

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
  const handleActionStartType = (value: string) => {
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
  // const handleParameterSensor = (value: string) => {
  //   setParameterSensor(value);
  // };
  const handleStartDevice = (value: string) => {
    setStartDevice(value);
  };
  const handleExecDevice = (value: string) => {
    setActionExecDevice(value);
  };

  const handleExecPrt = (value: string) => {
    setActionExecPrt(value);
  };
  const handleUserSelect = (value: string) => {
    const user = users.find((user) => user.id === value);
    console.log(user);
    setSelectedUser(value);
  };
  const handleDeviceDest = (value: string) => {
    setDeviceDest(value);
  };
  const handleButtonSelect = (value: string) => {
    setActionValue(value);
  };

  const handleActionExecTypeCommandMode = (value: string) => {
    setActionExecTypeCommandMode(value);
  };
  const userButtons = buttons.filter((button) => {
    return button.button_user === selectedUser;
  });

  const selectedStartSensor = sensors.filter((p) => {
    return p.sensor_name === actionSensorName;
  })[0]; // filtra os sensores IoT

  const filteredStartSensor = selectedStartSensor
    ? selectedStartSensor.parameters
    : []; // verifica 

  const selectedExecSensor = sensors.filter((p) => {
    return p.sensor_name === actionExecDevice;
  })[0];

  const filteredExecSensor = selectedExecSensor
    ? selectedExecSensor.parameters
    : [];
  
  const selectedExecSensorValue = sensors.filter((p) => {
    return p.sensor_name === actionExecDevice;
  })[0];
  const filteredSelectExecSensor = selectedExecSensorValue
  ? selectedExecSensorValue.parameters
  : [];

  const updateExecSensorValue = sensors.filter((p) => {
    return p.devEUI === actionExecDevice;
  })[0];

  // const updateExecSensorParameter = updateExecSensorValue?.parameters.filter((p) => {
  //   return p.parameter === action?.action_exec_prt;
  // })[0]

  console.log("Botões na userButtons", updateExecSensorValue?.parameters[0].parameter);

  const handleCreateAction = () => {
    console.log(
      `User: ${JSON.stringify(
        selectedUser
      )}, Action Name: ${actionName}, Action Type: ${actionStartType}, Parâmetro da Ação: ${actionSensorParameter}, Valor da Ação: ${actionExecValue}, Tipo de Ação: ${actionExecType}`
    );
    if (actionName && actionStartType && actionStartParameter) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateAction" : "InsertAction",
        ...(isUpdate && { id: action?.id }),
        name: actionName,
        startPrt: actionStartParameter,
        startType: actionStartType,
        sensorParameter: actionSensorParameter,
        sensorName: actionSensorName,
        guid: selectedUser,
        execType: actionExecType,
        execDevice: selectedExecSensorValue.devEUI,
        commandMode: actionExecTypeCommandMode,
        execPrt: actionExecPrt,
        //execValue: actionExecValue,
      });
      setIsCreating(false);
      setActionName("");
      setActionParameter("");
      setActionValue("");
      // wss?.sendMessage({
      //   api: "admin",
      //   mt: isUpdate ? "UpdateAction" : "InsertAction",
      //   ...(isUpdate && { id: action?.id }),
      //   name: actionName,
      //   alarm: actionType,
      //   start: actionParameter,
      //   value: actionValue,
      //   sip: selectedUser,
      //   type: type,
      //   device: deviceDest,
      //   sensorType: typeMeasure,
      //   sensorName: nameSensor,
      // });
      // setIsCreating(false);
      // setActionName("");
      // setActionParameter("");
      // setActionValue("");
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes de criar o botão.",
      });
    }
  };
  const shouldRenderInput =
    actionStartType === "minValue" || actionStartType === "maxValue";
  const shouldRenderDevice = actionExecType === "number";
  const shouldRenderType = actionExecType === "button";
  return (
    //div que contem os cards
    <div className="w-full">
      <CardHeader>
        <CardTitle>Create Action</CardTitle>
        <CardDescription>Create Action TEXT</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Card de criação da ação */}
        <div className="w-full">
          <div className="grid gap-4 p-4">
            <CardDescription>Action Name</CardDescription>
            <div className="grid grid-cols-8 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome da ação
              </Label>
              <Input
                className="col-span-7"
                id="name"
                placeholder="Nome da ação"
                type="text"
                value={actionName}
                onChange={handleActionName}
              />
            </div>
          </div>
          <div className="flex columns gap-4 p-4 justify-between">
            <div className="gap-4 flex flex-col align-top">
              <CardDescription>
                Configuração dos parâmetros de Gatilho
              </CardDescription>
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
                <Select
                  onValueChange={handleActionStartType}
                  value={actionStartType}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Selecione o Gatilho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gatilho</SelectLabel>
                      <SelectItem value="alarm">Alarme</SelectItem>
                      <SelectItem value="origemNumber">
                        Número Origem
                      </SelectItem>
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
                        IoT Device
                      </Label>
                    </div>
                    <Select
                      value={actionSensorName}
                      onValueChange={handleNameSensor}
                    >
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
                    <Select
                      value={actionSensorParameter}
                      onValueChange={handleStartDevice}
                    >
                      <SelectTrigger
                        className="col-span-2"
                        id="SelectTypeMeasure"
                      >
                        <SelectValue placeholder="Selecione o tipo de medida" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Sensores</SelectLabel>
                          {filteredStartSensor.map((sensor, i) => (
                            <SelectItem key={i} value={sensor.parameter}>
                              {sensor.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
                  value={actionStartParameter}
                  onChange={handleParameterAction}
                />
              </div>
            </div>
            <div className="gap-4 flex flex-col align-top">
              <CardDescription>
                Configuração dos parâmetros de execução
              </CardDescription>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-end" htmlFor="name">
                  Tipo
                </Label>
                <Select onValueChange={handleType} value={actionExecType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gatilho</SelectLabel>
                      <SelectItem value="alarm">Alarme</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="button">Botão</SelectItem>
                      <SelectItem value="command">Comando</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {shouldRenderDevice && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-end" htmlFor="paramDest">
                    Dispositivo
                  </Label>
                  <Select onValueChange={handleDeviceDest} value={deviceDest}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Dispositivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Softphone">Softphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* {shouldRenderType && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-end" htmlFor="paramDest">
                    Botão
                  </Label>
                  <Select
                    onValueChange={handleButtonSelect}
                    value={actionValue}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>
                          {texts[language].headerButtons}
                        </SelectLabel>
                        {userButtons.map((button) => (
                          <SelectItem key={button.id} value={button.id as any}>
                            {button.button_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )} */}
              {actionExecType === "command" && (
                <div>
                  <div className="gap-1">
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                      <div className="flex justify-end gap-1">
                        <Label
                          htmlFor="name"
                          title="Qual contexto irá executar essa ação"
                        >
                          IoT Device
                        </Label>
                      </div>
                      <Select
                        value={actionExecDevice}
                        onValueChange={handleExecDevice}
                      >
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
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                      <div className="flex justify-end gap-1">
                        <Label
                          className="text-end"
                          htmlFor="framework"
                          id="typeMeasure"
                        >
                          Tipo de medida
                        </Label>
                      </div>
                      <Select
                        value={updateExecSensorValue?.parameters[0].parameter}
                        onValueChange={handleExecPrt}
                      >
                        <SelectTrigger
                          className="col-span-3"
                          id="SelectTypeMeasure"
                        >
                          <SelectValue placeholder="Selecione o tipo de medida" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectGroup>
                            <SelectLabel>Sensores</SelectLabel>
                            {filteredSelectExecSensor.map((parameters, i) => (
                            <SelectItem key={i} value={parameters.parameter}>
                              {parameters.name}
                            </SelectItem>
                          ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-end" htmlFor="name">
                      Comando
                    </Label>
                    <Select
                      onValueChange={handleActionExecTypeCommandMode}
                      value={actionExecTypeCommandMode}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Comando On / Off</SelectLabel>
                          <SelectItem value="on">On</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {!shouldRenderType && actionExecType !== "command" && (
                <div className="grid grid-cols-4 items-center gap-4">
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
                    className="col-span-3"
                    id="name"
                    placeholder="Valor"
                    type="text"
                    value={actionExecValue}
                    onChange={handleActionValue}
                  />
                </div>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end">
            {!isCreating && (
              <Button onClick={handleCreateAction}>Criar Ação</Button>
            )}
            {isCreating && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criar Ação
              </Button>
            )}
          </CardFooter>
        </div>
      </CardContent>
    </div>
  );
}
