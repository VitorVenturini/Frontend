import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CircleAlert } from "lucide-react";

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
import {
  Megaphone,
  Home,
  Zap,
  Waves,
  User,
  Phone,
  Hospital,
  Flame,
  Siren,
} from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsersPbx } from "@/components/users/usersPbx/UsersPbxContext";
import { limitButtonName } from "@/components/utils/utilityFunctions";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import { useGoogleCalendar } from "@/components/googleCalendars/googleCalendarContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface ButtonDestProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function ModalGoogleCalendar({
  selectedUser,
  selectedPage,
  clickedPosition,
  existingButton,
  onClose,
  isUpdate = false,
}: ButtonDestProps) {
  const [nameButton, setNameButton] = useState(
    existingButton?.button_name || ""
  );
  const [paramButton, setParamButton] = useState(
    existingButton?.button_prt || ""
  );
  const [calendarButton, setCalendarButton] = useState(
    existingButton?.calendar_id || ""
  );
  const [iconButton, setIconButton] = useState(existingButton?.img || "Phone");
  const [deviceButton, setDeviceButton] = useState(
    existingButton?.button_device || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { usersPbx } = useUsersPbx();
  const { googleCalendars } = useGoogleCalendar();
  const { language } = useLanguage();
  const [isCalendarRequested, setIsCalendarRequested] = useState(false);

  const handleNameButton = (value: string) => {
    setNameButton(value);
  };
  const handleCalendarButton = (value: string) => {
    const name = googleCalendars.find((c)=>{return c.id == value}).summary
    setCalendarButton(value);
    setNameButton(name);
  };

  const handleDeviceButton = (value: string) => {
    setDeviceButton(value);
  };

  const handleIconButton = (newIcon: string) => {
    setIconButton(newIcon);
  };
  const filteredDevices = usersPbx?.filter((u) => {
    return u.guid === selectedUser?.sip;
  })[0];

  const handleCreateDest = () => {
    if (nameButton && deviceButton) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateButton" : "InsertButton",
        ...(isUpdate && { id: existingButton?.id }),
        name: nameButton,
        calendar_id: calendarButton,
        guid: selectedUser?.guid,
        type: "google_calendar",
        device: deviceButton,
        value: "",
        img: iconButton,
        page: selectedPage,
        x: clickedPosition?.j,
        y: clickedPosition?.i,
      });
      onClose?.();
      setIsCreating(false);
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes de criar o botão.",
      });
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
    // setNameDest("");
    // setParamDest("");
    // setIconDest("");
    // setDeviceDest("");
    // setIsCreating(false);
    // setIsUpdate(false);
  };
  const iconSize = 18;

  const handleGoogleCalendarsList = () => {
    if (!isCalendarRequested) {
      wss?.sendMessage({
        api: "admin",
        mt: "RequestGoogleCalendars"
      });
      setIsCalendarRequested(true); // Atualiza o estado para evitar reenvio
    }
  }
  // Chamada automática do `handleGoogleApiStatus` ao carregar o componente
  useEffect(() => {
    handleGoogleCalendarsList();
  }, []);
  return (
    <>
      {isUpdate && (
        <CardHeader>
          <CardTitle>
            {isUpdate ? texts[language].updateOfButtonCall : texts[language].createOfButtonCall} 
          </CardTitle>
          <CardDescription>
            {isUpdate ? texts[language].fillAllFieldsForUpdateCall : texts[language].fillAllFieldsForCreateCall}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-6 grid-rows-3 gap-4 py-4">
          <div className="flex align-middle justify-end items-center">
            <Label className="text-end" htmlFor="destName">
            {texts[language].buttonName}
            </Label>
          </div>
          <div className="col-span-2">
          <Select value={calendarButton} onValueChange={handleCalendarButton}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um calendário" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].calendars}</SelectLabel>
                  {googleCalendars?.map((c, index) => (
                    <SelectItem className={`bg-[${c.backgroudColor}] text-white`} key={index} value={c.id as string}>
                      {c.summary}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-start-4">
           
            {nameButton.trim() === "" && (
              <div className="text-[10px] text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                {texts[language].requiredField}
              </div>
            )}
          </div>
          <div className="col-start-4 row-start-2">
          
            {paramButton.trim() === "" && (
              <div className="text-[10px] text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                {texts[language].requiredField}
              </div>
            )}
          </div>
          <div className="col-start-1 row-start-3 align-middle flex justify-end items-center">
         
            <Label className="text-end" htmlFor="paramDest">
            {texts[language].devices}
            </Label>
          </div>
          <div className="col-span-2 col-start-2 row-start-3">
         
            <Select value={deviceButton} onValueChange={handleDeviceButton}>
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
          <div className="col-start-4 row-start-3">
  
            {deviceButton.trim() === "" && (
              <div className="text-[10px] text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
                <CircleAlert size={15} />
                {texts[language].requiredField}
              </div>
            )}
          </div>
          <div className="col-span-2 row-span-3 col-start-5 row-start-1">
          <Label>
          {texts[language].selectIcon}
            </Label>
            <div className="grid grid-cols-3 gap-4 p-2 align-middle items-center justify-center bg-muted h-ful">
              <div onClick={() => handleIconButton('Phone')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Phone' ? 'bg-background' : ''}`}>
                <Phone size={iconSize} />
              </div>
              <div onClick={() => handleIconButton('Siren')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Siren' ? 'bg-background' : ''}`}>
                <Siren size={iconSize} />
              </div>
              <div onClick={() => handleIconButton('Waves')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Waves' ? 'bg-background' : ''}`}>
                <Waves size={iconSize} />
              </div>
              <div onClick={() => handleIconButton('Home')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Home' ? 'bg-background' : ''}`}>
                <Home size={iconSize} />
              </div>
              <div onClick={() => handleIconButton('Zap')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Zap' ? 'bg-background' : ''}`}>
                <Zap size={iconSize} />
              </div>
              <div onClick={() => handleIconButton('Hospital')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Hospital' ? 'bg-background' : ''}`}>
                <Hospital size={iconSize} />
              </div>
              <div onClick={() => handleIconButton('Flame')} className={`cursor-pointer flex justify-center p-2 ${iconButton === 'Flame' ? 'bg-background' : ''}`}>
                <Flame size={iconSize} />
              </div>
            </div>
          </div>
        </div>

        <CardFooter className="flex justify-end w-full">
          {isUpdate && (
            <div className="flex w-full justify-between">
              <Button variant="secondary">
                <AlertDialog>
                  <AlertDialogTrigger className="w-full h-full">
                  {texts[language].delete}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{texts[language].areYouSure}</AlertDialogTitle>
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
            <Button onClick={handleCreateDest}>
              {isUpdate ? texts[language].updateButton : texts[language].createButton}
            </Button>
          )}
          {isCreating && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUpdate ? texts[language].updateButton : texts[language].createButton}
            </Button>
          )}
        </CardFooter>
      </CardContent>
    </>
  );
}
