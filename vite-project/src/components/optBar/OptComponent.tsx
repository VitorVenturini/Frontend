import { AccountContext } from "../account/AccountContext";
import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
import React, { useEffect, useState, ChangeEvent, useContext } from "react";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "../ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  Plus,
  OctagonAlert,
  Megaphone,
  Home,
  Zap,
  Waves,
  User,
  Hospital,
  Phone,
  Flame,
  Layers3,
  Rss,
  Siren,
} from "lucide-react";
import { useSensors } from "../sensor/SensorContext";
import CardOptSensor from "@/components/sensor/CardOptSensor";
import CardOptGeneric from "./CardOptGeneric";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface OptProps {
  button: ButtonInterface;
  onClick: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedOpt: string;
  isClicked: boolean;
}

export default function OptComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedOpt,
  isClicked,
}: OptProps) {
  const { isAdmin } = useContext(AccountContext);
  const handleClick = () => {
    onClick();
  };
  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-center justify-center";

  const getDialogContent = () => {
    console.log(selectedOpt);
    switch (selectedOpt) {
      case "floor":
        return (
          <CardOptGeneric
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );
      case "maps":
        return (
          <CardOptGeneric
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );
      case "sensor":
        return (
          <CardOptSensor
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );
      case "radio":
        return (
          <>
            <DialogTitle>RADIO COMING SOON</DialogTitle>
          </>
        );
        break;
      case "video":
        return (
          <CardOptGeneric
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );
      case "chat":
        return (
          <CardOptGeneric
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );

        break;
      default:
        return (
          <>
            <DialogTitle>Criar um botão</DialogTitle>
          </>
        );
    }
  };

  const renderButtonContent = () => {
    if (!button.button_type) {
      // Caso default quando não há botões ou outro caso genérico
      if (isAdmin) {
        return (
          <Dialog>
            <DialogTrigger>
              <div
                className={`${commonClasses} flex items-center justify-center`}
                onClick={handleClick}
              >
                <Plus />
              </div>
            </DialogTrigger>
            <DialogContent>{getDialogContent()}</DialogContent>
          </Dialog>
        );
      } else {
        return (
          <div
            className={`${commonClasses} flex items-center justify-center `}
          ></div>
        );
      }
    } else if (button.button_type === "sensor") {
      // Caso específico para o tipo "sensor"
      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <div
                className={`${commonClasses} flex flex-col cursor-pointer ${
                  isClicked ? "bg-zinc-950" : ""
                }`}
                onClick={handleClick}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <p className="text-sm font-medium leading-none">
                    {button.button_name}
                  </p>
                </div>
                {/* <div>
                    <p>{button.button_prt}</p>
                  </div> */}
              </div>
            </DialogTrigger>
            {isAdmin && (
              <DialogContent>
                <CardOptSensor
                  selectedUser={selectedUser}
                  selectedOpt={selectedOpt}
                  clickedPosition={clickedPosition}
                  existingButton={button}
                  isUpdate={true}
                />
              </DialogContent>
            )}
          </Dialog>
        </div>
      );
    } else {
      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <div
                className={`${commonClasses} flex flex-col cursor-pointer ${
                  isClicked ? "bg-zinc-950" : ""
                }`}
                onClick={handleClick}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <p className="text-sm font-medium leading-none">
                    {button.button_name}
                  </p>
                </div>
              </div>
            </DialogTrigger>
            {isAdmin && (
              <DialogContent>
                <CardOptGeneric
                  selectedUser={selectedUser}
                  selectedOpt={selectedOpt}
                  clickedPosition={clickedPosition}
                  existingButton={button}
                  isUpdate={true}
                />
              </DialogContent>
            )}
          </Dialog>
        </div>
      );
    }
  };

  return renderButtonContent();
}
