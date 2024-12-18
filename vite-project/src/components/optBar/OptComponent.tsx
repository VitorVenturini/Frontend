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
import { UserInterface } from "../users/usersCore/UserContext";

interface OptProps {
  button: ButtonInterface;
  onClick: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
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
    setSensorType("");
    onClick();
  };

  const handleSensorTypeChange = (value: string) => {
    setSensorType(value);
  };

  const commonClasses =
    "w-[60px] h-[40px]  xl2:w-[60px] xl3:h-[60px] xl4:h-[80px] xl4:w-[80px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-start justify-center text-left text-wrap truncate focus:bg-background";

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
            <CardHeader>
              <CardTitle>Selecione o Tipo</CardTitle>
              <CardDescription>
                Selecione o tipo de botão: Sensor ou Câmera
              </CardDescription>
            </CardHeader>
            <CardContent className="grid py-1">
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
            </CardContent>
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
            <DialogContent 
            className="min-w-[600px] max-w-5xl w-full"
            >{getDialogContent()}</DialogContent>
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
                  isClicked ? "bg-background" : ""
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
              <DialogContent className="min-w-[600px] max-w-5xl w-full">
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
    } else if (button.button_type === "camera") {
      // caso específico para edição de botão do tipo "camera"
      return (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogTrigger asChild>
              <div
                className={`${commonClasses} flex flex-col cursor-pointer text-wrap ${
                  isClicked ? "bg-background" : ""
                }`}
                onClick={handleClick}
              >
                <div className="flex items-center gap-1 cursor-pointer text-wrap">
                  <p className="text-sm font-medium leading-none text-clip text-pretty">
                    {button.button_name}
                  </p>
                </div>
              </div>
            </DialogTrigger>
            {isAdmin && (
              <DialogContent className="min-w-[600px] max-w-5xl w-full">
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
    } else {
      // edição de botões que nao forem do tipo "sensor"
      return (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div
                className={`${commonClasses} flex flex-col cursor-pointer ${
                  isClicked ? "bg-background" : ""
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
              <DialogContent className="min-w-[600px] max-w-5xl w-full">
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
