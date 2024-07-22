import { AccountContext } from "../account/AccountContext";
import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
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
// import CardOptCamera from "@/components/camera/CardOptCamera"; // Importe o componente CardOptCamera
import CardOptGeneric from "./CardOptGeneric";
import CardOptCamera from "../cameras/CardOptCamera";

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sensorType, setSensorType] = useState("");

  const handleClick = () => {
    setSensorType("")
    onClick();
  };

  const handleSensorTypeChange = (value: string) => {
    setSensorType(value);
  };

  const commonClasses =
    "w-[60px] h-[60px]  xl:w-[60px] xl:h-[60px] 2xl:w-[80px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-center justify-center";

  const getDialogContent = () => {
    switch (selectedOpt) {
      case "floor":
      case "maps":
      case "video":
      case "chat":
        return (
          <CardOptGeneric
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );
      case "sensor":
        return (
          <>
          <CardHeader>Selecione o Tipo</CardHeader>
            <Select onValueChange={handleSensorTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="camera">Câmera</SelectItem>
                <SelectItem value="sensor">Sensor</SelectItem>
              </SelectContent>
            </Select>
            {sensorType === "sensor" && (
              <CardOptSensor
                selectedUser={selectedUser}
                selectedOpt={selectedOpt}
                clickedPosition={clickedPosition}
                onClose={() => setIsDialogOpen(false)}
              />
            )}
            {sensorType === "camera" && (
              <CardOptCamera
                selectedUser={selectedUser}
                selectedOpt={selectedOpt}
                clickedPosition={clickedPosition}
                onClose={() => setIsDialogOpen(false)}
              />
            )}
          </>
        );
      case "radio":
        return <DialogTitle>RADIO COMING SOON</DialogTitle>;
      default:
        return <DialogTitle>Criar um botão</DialogTitle>;
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
      // caso específico para edição de botão do tipo "sensor"
      return (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <CardOptSensor
                  selectedUser={selectedUser}
                  selectedOpt={selectedOpt}
                  clickedPosition={clickedPosition}
                  existingButton={button}
                  isUpdate={true}
                  onClose={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            )}
          </Dialog>
        </div>
      );
    }else if (button.button_type === "camera") {
      // caso específico para edição de botão do tipo "camera"
      return (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <CardOptCamera
                  selectedUser={selectedUser}
                  selectedOpt={selectedOpt}
                  clickedPosition={clickedPosition}
                  existingButton={button}
                  isUpdate={true}
                  onClose={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            )}
          </Dialog>
        </div>
      );
    }
    else {
      // edição de botões que nao forem do tipo "sensor"
      return (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  onClose={() => setIsDialogOpen(false)}
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
