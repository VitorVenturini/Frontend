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
import { Loader2, CircleAlert } from "lucide-react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { useSensors } from "@/components/sensor/SensorContext";
import { limitButtonName } from "@/components/utils/utilityFunctions";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface ButtonProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function ModalCommand({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose,
}: ButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { sensors } = useSensors();
  const { language } = useLanguage();

  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [nameCommand, setNameCommand] = useState(
    existingButton?.button_prt || ""
  );
  const [deviceEUID, setDeviceEUID] = useState(
    existingButton?.button_device || ""
  );
  const [typeMeasure, setTypeMeasure] = useState(
    existingButton?.sensor_type || ""
  );

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };

  const handleNameCommand = (value: string) => {
    setNameCommand(value);
  };

  const handleDeviceIot = (value: string) => {
    setDeviceEUID(value);
  };

  const handleTypeMeasure = (value: string) => {
    setTypeMeasure(value);
  };

  const handleCreateButton = () => {
    try {
      if (nameButton && nameCommand && deviceEUID) {
        const sensorInfo = sensors.filter((sensor) => {
          return sensor.deveui === deviceEUID;
        })[0];
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateButton" : "InsertButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: nameCommand,
          guid: selectedUser?.guid,
          type: "command",
          device: sensorInfo.deveui,
          gateway_id: sensorInfo.gateway_id,
          img: sensorInfo.description,
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
          description: texts[language].fillFieldsForCommandButton,
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

  const IotControllers = sensors.filter((sensor) => {
    return sensor.description?.startsWith("UC");
  });

  const selectedSensor = sensors.filter((sensor) => {
    return sensor.deveui === deviceEUID;
  })[0];

  let commandParameters = selectedSensor ? selectedSensor.parameters : [];

  if (selectedSensor?.description?.startsWith("UC")) {
    commandParameters = commandParameters.filter((param) =>
      param.parameter.includes("out")
    );
  }

  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>
            {isUpdate
              ? texts[language].updateCommandButton
              : texts[language].createCommandButton}
          </CardTitle>
          <CardDescription>
            {isUpdate
              ? texts[language].updateCommandButtonDescription
              : texts[language].createCommandButtonDescription}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
            {texts[language].commandButtonNameLabel}
          </Label>
          <Input
            className="col-span-2"
            id="buttonName"
            placeholder={texts[language].commandButtonNamePlaceholder}
            value={nameButton}
            onChange={handleNameButton}
            required
          />
          {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].requiredField}
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
            {texts[language].selectDeviceLabel}
          </Label>
          <Select value={deviceEUID} onValueChange={handleDeviceIot}>
            <SelectTrigger className="col-span-2">
              <SelectValue
                placeholder={texts[language].selectDevicePlaceholder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{texts[language].devices}</SelectLabel>
                {IotControllers.map((sensor) => (
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
          {deviceEUID.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].requiredField}
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4 ">
          <div className="flex justify-end gap-1">
            <Label className="text-end" htmlFor="framework" id="typeMeasure">
              {texts[language].measureTypeLabel}
            </Label>
          </div>
          <Select
            value={nameCommand}
            onValueChange={handleNameCommand}
            disabled={!deviceEUID}
          >
            <SelectTrigger className="col-span-2" id="SelectTypeMeasure">
              <SelectValue
                placeholder={texts[language].selectMeasureTypePlaceholder}
              />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>{texts[language].measures}</SelectLabel>
                {commandParameters.map((parameters, i) => (
                  <SelectItem key={i} value={parameters.parameter}>
                    {parameters.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {nameCommand.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].requiredField}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end w-full">
        {isUpdate && (
          <div className="flex w-full justify-between">
            <Button variant="secondary">
              <AlertDialog>
                <AlertDialogTrigger>{texts[language].delete}</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {texts[language].confirmDeleteTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {texts[language].confirmDeleteDescriptionCommand}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{texts[language].cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteButton}>
                      {texts[language].delete}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
          </div>
        )}
        {!isCreating && (
          <Button onClick={handleCreateButton}>
            {isUpdate
              ? texts[language].updateCommandButton
              : texts[language].createCommandButton}
          </Button>
        )}
        {isCreating && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUpdate
              ? texts[language].updateCommandButton
              : texts[language].createCommandButton}
          </Button>
        )}
      </CardFooter>
    </>
  );
}
