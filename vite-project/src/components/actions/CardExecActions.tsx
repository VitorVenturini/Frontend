import { CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
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
import { useSensors } from "@/components/sensor/SensorContext";
import { ActionsInteface } from "./ActionsContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { useUsers } from "../users/usersCore/UserContext";
import { useUsersPbx } from "@/components/users/usersPbx/UsersPbxContext";

interface UpdateActionsProps {
  action?: ActionsInteface;
  onUpdateExecActionDetails: (key: string, value: string) => void;
}

export default function CardExecActions({
  action,
  onUpdateExecActionDetails,
}: UpdateActionsProps) {
  const { users } = useUsers();
  const { usersPbx } = useUsersPbx();
  const [actionExecType, setType] = useState(action?.action_exec_type || "");
  //   const [actionExecValue, setActionValue] = useState(""); //SEM USO NO MOMENTO
  const [selectedUser, setSelectedUser] = useState(
    action?.action_exec_user || ""
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
  const filteredDevices = usersPbx?.filter((u) => {
    return u.guid === selectedUser;
  })[0];

  const { language } = useLanguage();
  const { toast } = useToast();
  const { sensors } = useSensors();
  const { buttons } = useButtons();
  console.log("ACTION SELECTUSER", selectedUser, filteredDevices);
  const handleType = (value: string) => {
    setType(value);
    onUpdateExecActionDetails("actionExecType", value);
  };

  const handleExecDevice = (value: string) => {
    setActionExecDevice(value);
    onUpdateExecActionDetails("actionExecDevice", value);
  };
  const handleActionValue = (event: ChangeEvent<HTMLInputElement>) => {
    setActionExecPrt(event.target.value);
    onUpdateExecActionDetails("actionExecValue", event.target.value);
  };

  const handleExecPrt = (value: string) => {
    setActionExecPrt(value);
    onUpdateExecActionDetails("actionExecPrt", value);
  };

  const handleUserSelect = (value: string) => {
    const user = users.find((user) => (user.id as any) === value);
    setSelectedUser(value);
    onUpdateExecActionDetails("selectedUser", value);
  };

  const handleDeviceDest = (value: string) => {
    setDeviceDest(value);
    onUpdateExecActionDetails("deviceDest", value);
  };

  const handleButtonSelect = (value: string) => {
    setActionExecPrt(value);
    onUpdateExecActionDetails("actionExecValue", value);
  };

  const handleActionExecTypeCommandMode = (value: string) => {
    setActionExecTypeCommandMode(value);
    onUpdateExecActionDetails("actionExecTypeCommandMode", value);
  };

  const userButtons = buttons.filter((button) => {
    return button.button_user === selectedUser;
  });

  const selectedExecSensor = sensors.filter((p) => {
    return p.deveui === actionExecDevice;
  })[0];

  const selectedExecSensorValue = sensors.filter((p) => {
    return p.deveui === actionExecDevice;
  })[0];
  const filteredSelectExecSensor = selectedExecSensorValue
    ? selectedExecSensorValue.parameters
    : [];

  const updateExecSensorValue = sensors.filter((p) => {
    return p.deveui === actionExecDevice;
  })[0];

  const shouldRenderDevice = actionExecType === "number";
  const shouldRenderType = actionExecType === "button";

  return (
    <div>
      {/* CARD CREATE EXEC ACTIONS*/}
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
            <Label className="text-end" htmlFor="name">
              User
            </Label>
            <Select
              onValueChange={handleUserSelect}
              value={action?.action_exec_user}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={texts[language].selectUserPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].users}</SelectLabel>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.sip}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label className="text-end" htmlFor="paramDest">
              Dispositivo
            </Label>
            <Select value={deviceDest} onValueChange={handleDeviceDest}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Dispositivos</SelectLabel>
                  {filteredDevices?.devices.map((dev, index) => (
                    <SelectItem key={index} value={dev.hw as string}>
                      {dev.text}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        {shouldRenderType && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="name">
              User
            </Label>
            <Select
              onValueChange={handleUserSelect}
              value={action?.action_exec_user}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={texts[language].selectUserPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].users}</SelectLabel>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.guid}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label className="text-end" htmlFor="paramDest">
              Botão
            </Label>
            <Select onValueChange={handleButtonSelect} value={actionExecPrt}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].headerButtons}</SelectLabel>
                  {userButtons.map((button) => (
                    <SelectItem key={button.id} value={button.id as any}>
                      {button.button_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

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
                          value={sensor?.deveui as string}
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
                  value={actionExecPrt}
                  onValueChange={handleExecPrt}
                  disabled={!actionExecDevice}
                >
                  <SelectTrigger className="col-span-3" id="SelectTypeMeasure">
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
                disabled={!actionExecPrt}
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
              value={actionExecPrt}
              onChange={handleActionValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}
