import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import React, { useEffect, useState, ChangeEvent, useContext } from "react";
import { useWebSocketData } from "./WebSocketProvider";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/select";

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
}

export default function OptComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedOpt,
}: OptProps) {
  const { isAdmin } = useContext(AccountContext);
  const [nameOpt, setNameOpt] = useState("");
  const [paramOpt, setParamOpt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();

  const handleClick = () => {
    onClick();
  };

  const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameOpt(event.target.value);
  };
  const handleParamOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamOpt(event.target.value);
  };

  const handleCreateOpt = () => {
    if (nameOpt && paramOpt) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: "InsertButton",
        name: nameOpt,
        value: paramOpt,
        guid: selectedUser?.guid,
        type: selectedOpt,
        page: "0",
        x: clickedPosition?.j,
        y: clickedPosition?.i,
      });
      setIsCreating(false);
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes de criar o botão.",
      });
    }
  };

  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-border text-card-foreground shadow-sm p-1";

  switch (button.button_type) {
    case "floor":
    case "maps":
    case "sensor":
    case "radio":
    case "video":
    case "chat":
      // no de usuario vamos adicionar alguns listeners para abrir a planta baixa , mapa , grafico de sensores etc
      // usar a flag IsAdmin
      return (
        <div className={`${commonClasses} flex flex-col`}>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium leading-none">
              {button.button_name}
            </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    default:
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
            <DialogContent>
              <DialogHeader>Criar Botão
                <DialogDescription>
                  Descrição
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-end" htmlFor="nameButton">
                  Nome do botão
                </Label>
                <Input
                  className="col-span-3"
                  id="nameButton"
                  placeholder="Nome do Botão"
                  // value={nameOpt}
                  onChange={handleNameOpt}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-end" htmlFor="paramOpt">
                  Parâmetro
                </Label>
                <Input
                  className="col-span-3"
                  id="paramOpt"
                  placeholder="Paramêtro"
                  // value={paramOpt}
                  onChange={handleParamOpt}
                  required
                />
              </div>
              <DialogFooter>
                {!isCreating && (
                  <Button onClick={handleCreateOpt}>Criar Botão</Button>
                )}
                {isCreating && (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criar Botão
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      } else {
        return (
          <div
            className={`${commonClasses} flex items-center justify-center`}
          ></div>
        );
      }
  }
}
