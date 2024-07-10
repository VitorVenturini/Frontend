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
  import CardExecActions from "./CardExecActions";

  interface User {
    id: string;
    name: string;
    guid: string;
  }
  
  interface UpdateActionsProps {
    action?: ActionsInteface;
    onUpdateTriggerActionDetails: (key: string, value: string) => void;
  }

export default function CardTriggerActions ({ action, onUpdateTriggerActionDetails }: UpdateActionsProps){
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
        action?.action_start_device_prt || ""
      );
      const { sensors } = useSensors();
      const handleActionStartType = (value: string) => {
        setActionType(value);
        onUpdateTriggerActionDetails("actionStartType", value)
      };
      const handleParameterAction = (event: ChangeEvent<HTMLInputElement>) => {
        setActionParameter(event.target.value);
        onUpdateTriggerActionDetails("actionStartPrt", event.target.value)
      };
    
      const handleNameSensor = (value: string) => {
        setNameSensor(value);
        onUpdateTriggerActionDetails("actionStartDevice", value)
      };
      // const handleParameterSensor = (value: string) => {
      //   setParameterSensor(value);
      // };
      const handleStartDevicePrt = (value: string) => {
        setStartDevicePrt(value);
        onUpdateTriggerActionDetails("actionStartDevicePrt", value)
      };
      const shouldRenderInput =
      actionStartType === "minValue" || actionStartType === "maxValue";
      
      const selectedStartSensor = sensors.filter((p) => {
        return p.devEUI === actionSensorName;
      })[0]; // filtra os sensores IoT
    
      const filteredStartSensor = selectedStartSensor
        ? selectedStartSensor.parameters
        : []; // verifica
    
  
    return(
        <div>
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
                              value={sensor?.devEUI as string}
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
                      onValueChange={handleStartDevicePrt}
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
        </div>
    )
}