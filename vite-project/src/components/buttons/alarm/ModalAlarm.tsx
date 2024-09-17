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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { useState, ChangeEvent } from "react";
import { Loader2, CircleAlert } from "lucide-react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
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

export default function ModalAlarm({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  isUpdate = false,
  onClose,
}: ButtonProps) {
  const [numberAlarm, setNumberAlarm] = useState(
    existingButton?.button_prt || ""
  );
  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { language } = useLanguage();

  const handleNameButton = (event: ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameButton(limitedName);
  };
  const handleNumberAlarm = (event: ChangeEvent<HTMLInputElement>) => {
    setNumberAlarm(event.target.value);
  };

  const handleCreateButton = () => {
    try {
      if (nameButton && numberAlarm) {
        setIsCreating(true);
        const message = {
          api: "admin",
          mt: isUpdate ? "UpdateButton" : "InsertButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: numberAlarm,
          guid: selectedUser?.guid,
          type: "alarm",
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
          description: texts[language].fillAllFieldsForAlarm,
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
            {isUpdate
              ? texts[language].updateAlarmButton
              : texts[language].createAlarmButton}
          </CardTitle>
          <CardDescription>
            {isUpdate
              ? texts[language].updateAlarmButtonDescription
              : texts[language].createAlarmButtonDescription}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="grid gap-5 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
            {texts[language].alarmButtonNameLabel}
          </Label>
          <Input
            className="col-span-2"
            id="buttonName"
            placeholder={texts[language].alarmButtonNamePlaceholder}
            value={nameButton}
            onChange={handleNameButton}
            required
          />
          {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].alarmButtonRequired}
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="numberAlarm">
            {texts[language].alarmNumberLabel}
          </Label>
          <Input
            className="col-span-2"
            id="numberAlarm"
            placeholder={texts[language].alarmNumberPlaceholder}
            value={numberAlarm}
            onChange={handleNumberAlarm}
            required
          />
          {numberAlarm.trim() === "" && (
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
                <AlertDialogTrigger>{texts[language].delete}</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {texts[language].confirmDeleteTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {texts[language].confirmDeleteDescription}
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
              ? texts[language].updateAlarmButton
              : texts[language].createAlarmButton}
          </Button>
        )}
        {isCreating && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUpdate
              ? texts[language].updatingAlarmButton
              : texts[language].creatingAlarmButton}
          </Button>
        )}
      </CardFooter>
    </>
  );
}
