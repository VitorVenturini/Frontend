import ResponsivePng from "./ResponsivePng";
import { commonClasses } from "../buttons/ButtonsComponent";
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
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { useSensors } from "./SensorContext";
import { getText, limitButtonName } from "../utils/utilityFunctions";
import SensorCard from "./sensorCell";
import { ScrollArea } from "../ui/scroll-area";
import { UserInterface } from "../users/usersCore/UserContext";
import { useLanguage } from "../language/LanguageContext";
import texts from "../../_data/texts.json";
interface ButtonProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function ModalSensor({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose,
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

  const [geralThreshold, setGeralThreshold] = useState(
    existingButton?.sensor_max_threshold || ""
  );

  const [modelSensor, setModelSensor] = useState(existingButton?.img || "");
  const typePreview =
    typeMeasure.charAt(0).toUpperCase() + typeMeasure.slice(1);

  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { sensors } = useSensors();
  const wss = useWebSocketData();
  const { language } = useLanguage();
  const handleSensorClick = (deveui: string) => {
    setNameSensor(deveui); // Atualiza o estado do sensor clicado
    setTypeMeasure("");
  };

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };
  const handleTypeMeasure = (value: string) => {
    setTypeMeasure(value);
    value === "press_short" ||
    value === "press_double" ||
    value === "press_long"
      ? setGeralThreshold(value)
      : null;
    // condição especial para setar o tipo de medida do SmartButton no max_threshold
  };
  const handleMaxValue = (event: ChangeEvent<HTMLInputElement>) => {
    setGeralThreshold("");
    setMaxValue(event.target.value);
  };
  const handleMinValue = (event: ChangeEvent<HTMLInputElement>) => {
    setGeralThreshold("");
    setMinValue(event.target.value);
  };

  const handleGeralThreshold = (value: string) => {
    setGeralThreshold(value);
  };
  const handleMinWindThreshold = (value: string) => {
    setGeralThreshold("");
    setMinValue(value);
  };

  const handleMaxWindThreshold = (value: string) => {
    setGeralThreshold("");
    setMaxValue(value);
  };
  const filteredModel = sensors.filter((sensor) => {
    return sensor.deveui === nameSensor;
  })[0];
  const handleCreateButton = () => {
    try {
      if (nameButton && typeMeasure) {
        if (showMinMaxFields && (!maxValue || !minValue)) {
          toast({
            variant: "destructive",
            description:
              "Por favor, preencha os valores mínimo e máximo antes de criar o sensor.",
          });
          return;
        }
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateSensorButton" : "InsertSensorButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: nameSensor, //devEUID
          guid: selectedUser?.guid,
          type: "sensor",
          img: filteredModel.description,
          min: showSelectOnly ? "" : minValue,
          max: geralThreshold ? geralThreshold : maxValue,
          sensorType: typeMeasure,
          page: selectedPage,
          x: clickedPosition?.j,
          y: clickedPosition?.i,
        };
        wss?.sendMessage(message);
        setIsCreating(false);
        onClose?.();
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
      });
      onClose?.();
    } catch (e) {
      console.error(e);
    }
  };

  const typesWithoutMinMax = [
    "leak",
    "light",
    "pir",
    "daylight",
    "magnet_status",
    "wind_direction",
    "tamper_status",
    "press_short",
    "press_double",
    "press_long",
  ];
  const typesWithSelectOnly = [
    "magnet_status",
    "leak",
    "pir",
    "tamper_status",
    "daylight",
  ];

  const showMinMaxFields = !typesWithoutMinMax.includes(typeMeasure);
  const showSelectOnly = typesWithSelectOnly.includes(typeMeasure);

  const selectedSensor = sensors.filter((sensor) => {
    return sensor.deveui === nameSensor;
  })[0];

  let sensorParameters = selectedSensor ? selectedSensor.parameters : [];
  // remover parâmetros que contêm "out" no nome se a descrição do sensor começar com "UC" (todos iot controllers)
  if (selectedSensor?.description?.startsWith("UC")) {
    sensorParameters = sensorParameters.filter(
      (param) => !param.parameter.includes("out")
    );
  }
  const [filterDevice, setFilterDevice] = useState("");
  const handlefilterDevice = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterDevice(event.target.value);
  };
  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>Atualizar Botão</CardTitle>
          <CardDescription>descrição</CardDescription>
        </CardHeader>
      )}
      <CardContent className="max-w-5xl w-full flex gap-4 py-4">
        <div className="flex flex-col w-[50%] items-center gap-4">
          <Label
            className="text-end flex w-full items-center justify-center h-[30px]"
            htmlFor="buttonName"
          >
            Selecione o Sensor
          </Label>
          <Input
            className="w-full"
            id="buttonName"
            placeholder="Filtrar..."
            onChange={handlefilterDevice}
          />
          <div className="gap-4">
            <ScrollArea className="h-[350px] w-full border border-input">
              <SensorCard
                onSensorClick={handleSensorClick}
                filter={filterDevice}
              />
            </ScrollArea>
          </div>
        </div>
        <div className="flex flex-col w-[50%] justify-between gap-4">
          <div className="flex-col gap-4 h-[75%]">
            <div className="grid grid-cols-4 items-center gap-4 mt-9 py-1">
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
            <div className="grid grid-cols-4 items-center gap-4 py-1">
              <Label className="text-end" htmlFor="framework" id="typeMeasure">
                Tipo de medida
              </Label>
              <Select
                value={typeMeasure}
                onValueChange={handleTypeMeasure}
                disabled={!nameSensor}
              >
                <SelectTrigger className="col-span-3" id="SelectTypeMeasure">
                  <SelectValue placeholder="Selecione o tipo de medida" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {sensorParameters.map((param, index) => (
                    <SelectItem key={index} value={param.parameter}>
                      {getText(param.parameter.toLowerCase(), texts[language])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showMinMaxFields && (
              <>
                <div className="grid grid-cols-4 items-center py-1 gap-4">
                  <Label className="text-end" htmlFor="minValue">
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
                    disabled={!typeMeasure}
                  />
                </div>
                <div className="grid grid-cols-4 py-1 items-center gap-4">
                  <Label className="text-end" htmlFor="maxValue">
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
                    disabled={!typeMeasure}
                  />
                </div>
              </>
            )}
            {showSelectOnly && (
              <>
                <div className="grid grid-cols-4 py-1 items-center gap-4">
                  <Label className="text-end" htmlFor="SelectValue">
                    Valor para ativar o alarme
                  </Label>
                  <Select
                    value={geralThreshold}
                    onValueChange={handleGeralThreshold}
                    disabled={!typeMeasure}
                  >
                    <SelectTrigger className="col-span-3" id="SelectValue">
                      <SelectValue placeholder="Selecione um Valor" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectLabel>Selecione um Valor</SelectLabel>
                        {typeMeasure === "magnet_status" && (
                          <>
                            <SelectItem value="1">Aberto</SelectItem>
                            <SelectItem value="0">Fechado</SelectItem>
                          </>
                        )}
                        {typeMeasure === "tamper_status" && (
                          <>
                            <SelectItem value="1">Não Instalado</SelectItem>
                            <SelectItem value="0">Instalado</SelectItem>
                          </>
                        )}
                        {typeMeasure === "leak" && (
                          <>
                            <SelectItem value="1">Alagado</SelectItem>
                            <SelectItem value="0">Seco</SelectItem>
                          </>
                        )}
                        {typeMeasure === "pir" && (
                          <>
                            <SelectItem value="1">Presença</SelectItem>
                            <SelectItem value="0">Vazio</SelectItem>
                          </>
                        )}
                        {typeMeasure === "daylight" && (
                          <>
                            <SelectItem value="1">Luz</SelectItem>
                            <SelectItem value="0">Escuro</SelectItem>
                          </>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {typeMeasure === "wind_direction" && (
              <div>
                <div className="grid grid-cols-4 py-1 items-center gap-4 mb-4">
                  <Label className="text-end" htmlFor="SelectValue">
                    Valor Mínimo
                  </Label>
                  <Select
                    value={minValue}
                    onValueChange={handleMinWindThreshold}
                    disabled={!typeMeasure}
                  >
                    <SelectTrigger className="col-span-3" id="SelectValue">
                      <SelectValue placeholder="Selecione um Valor" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectLabel>Select a Value</SelectLabel>
                        <SelectItem value="N">North</SelectItem>
                        <SelectItem value="NE">Northeast</SelectItem>
                        <SelectItem value="E">East</SelectItem>
                        <SelectItem value="SE">Southeast</SelectItem>
                        <SelectItem value="S">South</SelectItem>
                        <SelectItem value="SW">Southwest</SelectItem>
                        <SelectItem value="W">West</SelectItem>
                        <SelectItem value="NW">Northwest</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 py-1 items-center gap-4">
                  <Label className="text-end" htmlFor="SelectValue">
                    Valor Máximo
                  </Label>
                  <Select
                    value={maxValue}
                    onValueChange={handleMaxWindThreshold}
                    disabled={!typeMeasure}
                  >
                    <SelectTrigger className="col-span-3" id="SelectValue">
                      <SelectValue placeholder="Selecione um Valor" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectLabel>Select a Value</SelectLabel>
                        <SelectItem value="N">North</SelectItem>
                        <SelectItem value="NE">Northeast</SelectItem>
                        <SelectItem value="E">East</SelectItem>
                        <SelectItem value="SE">Southeast</SelectItem>
                        <SelectItem value="S">South</SelectItem>
                        <SelectItem value="SW">Southwest</SelectItem>
                        <SelectItem value="W">West</SelectItem>
                        <SelectItem value="NW">Northwest</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <div className="flex-col gap-4 items-start justify-end align-bottom h-[25%]">
            <h4>Preview</h4>
            <div className={commonClasses}>
              <div className="flex flex-col justify-between cursor-pointer active:bg-red-900 bg-buttonSensor">
                <div className="flex items-center  gap-1 cursor-pointer ">
                  <ResponsivePng
                    sensorModel={filteredModel?.description}
                    size="icon"
                  />
                  <p className=" flex text-sm font-medium leading-none xl4:text-2xl">
                    {nameButton}
                  </p>
                </div>
                <p className="text-[9px] font-medium leading-none text-muted-foreground">
                  {filteredModel?.sensor_name}
                </p>
                {typePreview}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end w-full">
        {isUpdate && (
          <div className="flex w-full justify-between">
            <Button variant="secondary">
              <AlertDialog>
                <AlertDialogTrigger>Excluir</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso irá deletar
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
    </>
  );
}
