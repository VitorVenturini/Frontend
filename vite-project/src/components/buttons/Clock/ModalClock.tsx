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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
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
import { limitButtonName } from "@/components/utils/utilityFunctions";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface TimeZone {
  zoneName: string;
  gmtOffset: string;
}

interface ButtonProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function ModalClock({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose,
}: ButtonProps) {
  const [nameButton, setNameButton] = useState(existingButton?.button_name || "");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const { language } = useLanguage();

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=G76YA12PUTYG&format=json`);
        const data = await response.json();
        setTimeZones(data.zones as TimeZone[]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTimeZones();
  }, []);

  const handleTimeZoneChange = (value: string) => {
    setSelectedTimeZone(value);
  };

  const handleCreateButton = () => {
    try {
      if (nameButton && selectedTimeZone) {
        const gmtOffset = timeZones.find((tz) => tz.zoneName === selectedTimeZone);
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateButton" : "InsertButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: gmtOffset?.gmtOffset,
          guid: selectedUser?.guid,
          type: "clock",
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
          description: texts[language].fillAllFieldsForClock,
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

  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>
            {isUpdate ? texts[language].updateClockButton : texts[language].createClockButton}
          </CardTitle>
          <CardDescription>
            {isUpdate
              ? texts[language].updateClockButtonDescription
              : texts[language].createClockButtonDescription}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
            {texts[language].clockButtonNameLabel}
          </Label>
          <Input
            className="col-span-2"
            id="buttonName"
            placeholder={texts[language].clockButtonNamePlaceholder}
            value={nameButton}
            onChange={handleNameButton}
            required
          />
          {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              {texts[language].clockButtonRequired}
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="timeZone">
            {texts[language].timeZoneLabel}
          </Label>
          <Select value={selectedTimeZone} onValueChange={handleTimeZoneChange}>
            <SelectTrigger>
              <SelectValue placeholder={texts[language].selectTimeZonePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{texts[language].timeZones}</SelectLabel>
                {timeZones.map((tz, index) => (
                  <SelectItem key={index} value={String(tz.zoneName)}>
                    {tz.zoneName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {selectedTimeZone === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              {texts[language].timeZoneRequired}
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
                    <AlertDialogTitle>{texts[language].confirmDeleteTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{texts[language].confirmDeleteDescriptionClock}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{texts[language].cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteButton}>{texts[language].delete}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
          </div>
        )}
        {!isCreating && (
          <Button onClick={handleCreateButton}>
            {isUpdate ? texts[language].updateClockButton : texts[language].createClockButton}
          </Button>
        )}
        {isCreating && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUpdate ? texts[language].updatingClockButton : texts[language].creatingClockButton}
          </Button>
        )}
      </CardFooter>
    </>
  );
}
