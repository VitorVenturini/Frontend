import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import React, { useEffect, useState, ChangeEvent, useContext } from "react";
import { useWebSocketData } from "./WebSocketProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
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
import { useSensors } from "./SensorContext";
import CardOptSensor from "./CardOptSensor";

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
  isClicked: boolean
}

export default function OptComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedOpt,
  isClicked
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
        break;
      case "maps":
        break;
      case "sensor":
        return (
          <CardOptSensor
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            clickedPosition={clickedPosition}
          />
        );
      case "radio":
        break;
      case "video":
        break;
      case "chat":
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
      // Componentes genéricos para outros tipos
      return (
        <div className={`${commonClasses} flex flex-col`}>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium leading-none">
              {button.button_name}
            </p>
          </div>
          {/* <div>
              <p>{button.button_prt}</p>
            </div> */}
        </div>
      );
    }
  };

  return renderButtonContent();

  // const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNameOpt(event.target.value);
  // };
  // const handleParamOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setParamOpt(event.target.value);
  // };

  // const handleNameSensor = (value: string) => {
  //   setNameSensor(value)
  // }

  // const handleCreateOpt = () => {
  //   if (nameOpt && paramOpt || nameSensor) {
  //     setIsCreating(true);
  //     wss?.sendMessage({
  //       api: "admin",
  //       mt: "InsertButton",
  //       name: nameOpt,
  //       value: paramOpt,
  //       guid: selectedUser?.guid,
  //       type: selectedOpt,
  //       page: "0",
  //       x: clickedPosition?.j,
  //       y: clickedPosition?.i,
  //     });
  //     setIsCreating(false);
  //   } else {
  //     toast({
  //       variant: "destructive",
  //       description:
  //         "Por favor, preencha todos os campos antes de criar o botão.",
  //     });
  //   }
  // };
  // switch (button.button_type) {
  //   case "floor":
  //   case "maps":
  //   case "sensor":
  //     return (
  //       <div>
  //         <Dialog>
  //           <DialogTrigger asChild>
  //             <div
  //               className={`${commonClasses} flex flex-col cursor-pointer`}
  //               onClick={handleClick}
  //             >
  //               <div className="flex items-center gap-1 cursor-pointer">
  //                 <p className="text-sm font-medium leading-none">
  //                   {button.button_name}
  //                 </p>
  //               </div>
  //               {/* <div>
  //                 <p>{button.button_prt}</p>
  //               </div> */}
  //             </div>
  //           </DialogTrigger>
  //           {isAdmin && (
  //             <DialogContent>
  //               <CardOptSensor
  //                 selectedUser={selectedUser}
  //                 selectedOpt={selectedOpt}
  //                 clickedPosition={clickedPosition}
  //                 existingButton={button}
  //                 isUpdate={true}
  //               />
  //             </DialogContent>
  //           )}
  //         </Dialog>
  //       </div>
  //     );
  //   case "radio":
  //   case "video":
  //   case "chat":
  //     // no de usuario vamos adicionar alguns listeners para abrir a planta baixa , mapa , grafico de sensores etc
  //     // usar a flag IsAdmin
  //     return (
  //       <div className={`${commonClasses} flex flex-col`}>
  //         <div className="flex items-center gap-1">
  //           <p className="text-sm font-medium leading-none">
  //             {button.button_name}
  //           </p>
  //         </div>
  //         {/* <div>
  //           <p>{button.button_prt}</p>
  //         </div> */}
  //       </div>
  //     );
  //   default:
  //     if (isAdmin) {
  //       return (
  //         <Dialog>
  //           <DialogTrigger>
  //             <div
  //               className={`${commonClasses} flex items-center justify-center`}
  //               onClick={handleClick}
  //             >
  //               <Plus />
  //             </div>
  //           </DialogTrigger>
  //           {<DialogContent>{getDialogContent()}</DialogContent>}
  //         </Dialog>
  //       );
  //     } else {
  //       return (
  //         <div
  //           className={`${commonClasses} flex items-center justify-center`}
  //         ></div>
  //       );
  //     }
  // }
}
