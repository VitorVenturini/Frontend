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
  const filteredSipUser = users.find((user) => (user.guid as any) === selectedUser);

  const filteredDevices = usersPbx?.filter((u) => {
    return u.guid === filteredSipUser?.sip;
  })[0];
  console.log('ACTION PRT', actionExecPrt)
  const { language } = useLanguage();
  const { toast } = useToast();
  const { sensors } = useSensors();
  const { buttons } = useButtons();

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
    onUpdateExecActionDetails("actionExecPrt", event.target.value);
  };

  const handleExecPrt = (value: string) => {
    setActionExecPrt(value);
    onUpdateExecActionDetails("actionExecPrt", value);
  };

  const handleUserSelect = (value: string) => {
  
    setSelectedUser(value);
    onUpdateExecActionDetails("selectedUser", value);
  };

  const handleDeviceDest = (value: string) => {
    setDeviceDest(value);
    onUpdateExecActionDetails("actionExecDevice", value);
  };

  const handleButtonSelect = (value: string) => {
    setActionExecPrt(value);
    onUpdateExecActionDetails("actionExecPrt", value);
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

  const filteredSelectExecSensor = selectedExecSensor
    ? selectedExecSensor.parameters
    : [];

  const shouldRenderDevice = actionExecType === "number";
  const shouldRenderType = actionExecType === "button";

  return (
    <div>
      {/* CARD CREATE EXEC ACTIONS*/}
      <div className="gap-4 flex flex-col align-top">
        <CardDescription>
          {texts[language].execParametersDescription}
        </CardDescription>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="name">
            {texts[language].type}
          </Label>
          <Select onValueChange={handleType} value={actionExecType}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder={texts[language].selectType} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{texts[language].trigger}</SelectLabel>
                <SelectItem value="alarm">{texts[language].alarm}</SelectItem>
                <SelectItem value="number">{texts[language].number}</SelectItem>
                <SelectItem value="button">{texts[language].button}</SelectItem>
                <SelectItem value="command">
                  {texts[language].command}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {shouldRenderDevice && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="name">
              {texts[language].user}
            </Label>
            <Select
              onValueChange={handleUserSelect}
              value={selectedUser}
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
              {texts[language].device}
            </Label>
            <Select value={deviceDest} onValueChange={handleDeviceDest}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={texts[language].selectDevice} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].devices}</SelectLabel>
                  {filteredDevices?.devices?.map((dev, index) => (
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
              {texts[language].user}
            </Label>
            <Select
              onValueChange={handleUserSelect}
              value={selectedUser}
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
              {texts[language].button}
            </Label>
            <Select onValueChange={handleButtonSelect} value={actionExecPrt}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={texts[language].selectButton} />
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
                  <Label htmlFor="name" title={texts[language].iotContext}>
                    {texts[language].iotDevice}
                  </Label>
                </div>
                <Select
                  value={actionExecDevice}
                  onValueChange={handleExecDevice}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={texts[language].selectSensor} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{texts[language].sensors}</SelectLabel>
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
                  <Label className="text-end" htmlFor="framework">
                    {texts[language].measureType}
                  </Label>
                </div>
                <Select
                  value={actionExecPrt}
                  onValueChange={handleExecPrt}
                  disabled={!actionExecDevice}
                >
                  <SelectTrigger className="col-span-3" id="SelectTypeMeasure">
                    <SelectValue placeholder={texts[language].selectMeasure} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectLabel>{texts[language].sensors}</SelectLabel>
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
                {texts[language].command}
              </Label>
              <Select
                onValueChange={handleActionExecTypeCommandMode}
                value={actionExecTypeCommandMode}
                disabled={!actionExecPrt}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={texts[language].selectCommand} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{texts[language].onOffCommand}</SelectLabel>
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
              <Label htmlFor="name" title={texts[language].triggerInfo}>
                {texts[language].value}
              </Label>
              <Info className="size-[12px]" />
            </div>
            <Input
              className="col-span-3"
              id="name"
              placeholder={texts[language].valuePlaceholder}
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
