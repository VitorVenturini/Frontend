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
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useLanguage } from "@/components/language/LanguageContext";
import { useSensors } from "@/components/sensor/SensorContext";
import { useCameras } from "@/components/cameras/CameraContext";
import { ActionsInteface } from "./ActionsContext";
import { getText } from "../utils/utilityFunctions";
import { Textarea } from "../ui/textarea";

interface UpdateActionsProps {
  action?: ActionsInteface;
  onUpdateTriggerActionDetails: (key: string, value: string) => void;
}

export default function CardTriggerActions({
  action,
  onUpdateTriggerActionDetails,
}: UpdateActionsProps) {
  const { language } = useLanguage(); // Adicionando o suporte ao idioma
  const [actionStartType, setActionType] = useState(
    action?.action_start_type || ""
  );
  const [actionStartParameter, setActionParameter] = useState(
    action?.action_start_prt || ""
  );
  const [actionSensorName, setNameSensor] = useState(
    action?.action_start_device || ""
  );
  const [actionSensorParameter, setStartDevicePrt] = useState(
    action?.action_start_device_parameter || ""
  );
  const { sensors } = useSensors();
  const { cameras } = useCameras();

  const handleActionStartType = (value: string) => {
    setActionType(value);
    onUpdateTriggerActionDetails("actionStartType", value);
  };
  const handleParameterInsert = (event: ChangeEvent<HTMLInputElement>) => {
    setActionParameter(event.target.value);
    onUpdateTriggerActionDetails("actionStartPrt", event.target.value);
  };
  const handleCameraPromptInsert = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setActionParameter(event.target.value);
    onUpdateTriggerActionDetails("actionStartPrt", event.target.value);
  };
  const handleParameterSelect = (value: string) => {
    setActionParameter(value);
    onUpdateTriggerActionDetails("actionStartPrt", value);
  };

  const handleNameSensor = (value: string) => {
    setNameSensor(value);
    onUpdateTriggerActionDetails("actionStartDevice", value);
  };
  const handleStartDevicePrt = (value: string) => {
    setStartDevicePrt(value);
    onUpdateTriggerActionDetails("actionStartDevicePrt", value);
  };
  const shouldRenderInput =
    actionStartType === "minValue" ||
    actionStartType === "maxValue" ||
    actionStartType === "equalValue";

  const shouldRenderCameraSelect = actionStartType === "camera";

  const shouldRenderValueInput =
    actionStartType == "origemNumber" ||
    actionStartType == "destNumber" ||
    actionStartType == "alarm";

  const selectedStartSensor = sensors.filter((p) => {
    return p.deveui === actionSensorName;
  })[0]; // filtra os sensores IoT

  const filteredStartSensor = selectedStartSensor
    ? selectedStartSensor.parameters
    : []; // verifica

  return (
    <div>
      <div className="gap-4 flex flex-col align-top">
        <CardDescription>
          {texts[language].triggerParameterConfig}
        </CardDescription>
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="flex justify-end gap-1">
            <Label htmlFor="name" title={texts[language].actionContextTooltip}>
              {texts[language].triggerType}
            </Label>
            <Info className="size-[12px]" />
          </div>
          <Select onValueChange={handleActionStartType} value={actionStartType}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder={texts[language].selectTrigger} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{texts[language].trigger}</SelectLabel>
                <SelectItem value="alarm">{texts[language].alarm}</SelectItem>
                <SelectItem value="origemNumber">
                  {texts[language].sourceNumber}
                </SelectItem>
                <SelectItem value="destNumber">
                  {texts[language].destNumber}
                </SelectItem>
                <SelectItem value="minValue">
                  {texts[language].minValue}
                </SelectItem>
                <SelectItem value="equalValue">
                  {texts[language].equalValue}
                </SelectItem>
                <SelectItem value="maxValue">
                  {texts[language].maxValue}
                </SelectItem>
                <SelectItem value="camera">{texts[language].camera}</SelectItem>
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
                  title={texts[language].deviceContextTooltip}
                >
                  {texts[language].iotDevice}
                </Label>
              </div>
              <Select value={actionSensorName} onValueChange={handleNameSensor}>
                <SelectTrigger className="col-span-2">
                  <SelectValue
                    placeholder={texts[language].selectSensorPlaceholder}
                  />
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
            <div className="grid grid-cols-3 items-center gap-4 mb-4">
              <div className="flex justify-end gap-1">
                <Label
                  className="text-end"
                  htmlFor="framework"
                  id="typeMeasure"
                >
                  {texts[language].measureType}
                </Label>
              </div>
              <Select
                value={actionSensorParameter}
                onValueChange={handleStartDevicePrt}
              >
                <SelectTrigger className="col-span-2" id="SelectTypeMeasure">
                  <SelectValue
                    placeholder={texts[language].selectMeasureType}
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>{texts[language].sensors}</SelectLabel>
                    {filteredStartSensor.map((param, i) => (
                      <SelectItem key={i} value={param.parameter}>
                        {getText(
                          param.parameter.toLowerCase(),
                          texts[language]
                        )}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex justify-end gap-1">
                <Label
                  htmlFor="name"
                  title={texts[language].triggerValueTooltip}
                >
                  {texts[language].triggerParameter}
                </Label>
                <Info className="size-[12px]" />
              </div>

              <Input
                className="col-span-2"
                id="name"
                placeholder={texts[language].triggerParameterPlaceholder}
                type="text"
                value={actionStartParameter}
                onChange={handleParameterInsert}
              />
            </div>
          </div>
        )}
        {actionSensorParameter === "magnet_status" ||
          (actionSensorParameter === "tamper_status" && (
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                {texts[language].command}
              </Label>
              <Select
                onValueChange={handleParameterSelect}
                value={actionStartParameter}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder={texts[language].selectType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {texts[language].commandOpenClose}
                    </SelectLabel>
                    <SelectItem value="1">{texts[language].open}</SelectItem>
                    <SelectItem value="0">{texts[language].closed}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        {shouldRenderCameraSelect && (
          <div className="gap-1">
            <div className="grid grid-cols-3 items-center gap-4 mb-4">
              <div className="flex justify-end gap-1">
                <Label
                  htmlFor="name"
                  title={texts[language].triggerValueTooltip}
                >
                  {texts[language].triggerParameterCamera}
                </Label>
                <Info className="size-[12px]" />
              </div>

              <Select onValueChange={handleNameSensor} value={actionSensorName}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder={texts[language].selectDevice} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {texts[language].selectCameraPlaceholder}
                    </SelectLabel>
                    {cameras.map((cam) => (
                      <SelectItem key={cam.nickname} value={cam?.mac as string}>
                        {cam.nickname}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex justify-end gap-1">
                <Label
                  htmlFor="name"
                  title={texts[language].triggerValueTooltip}
                >
                  {texts[language].triggerCameraParameter}
                </Label>
                <Info className="size-[12px]" />
              </div>

              <Textarea
                className="col-span-4"
                id="name"
                placeholder={texts[language].triggerCameraPromptPlaceholder}
                value={actionStartParameter}
                onChange={handleCameraPromptInsert}
              />
            </div>
          </div>
        )}
        {shouldRenderValueInput && (
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="flex justify-end gap-1">
              <Label htmlFor="name" title={texts[language].triggerValueTooltip}>
                {texts[language].triggerParameter}
              </Label>
              <Info className="size-[12px]" />
            </div>

            <Input
              className="col-span-2"
              id="name"
              placeholder={texts[language].triggerParameterPlaceholder}
              type="text"
              value={actionStartParameter}
              onChange={handleParameterInsert}
            />
          </div>
        )}
      </div>
    </div>
  );
}
