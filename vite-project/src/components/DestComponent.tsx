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
interface DestProps {
  button: ButtonInterface;
  onClick: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedPage: string;
  isClicked: boolean
}

export default function DestComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedPage,
  isClicked
}: DestProps) {
  const { isAdmin } = useContext(AccountContext);
  const [nameDest, setNameDest] = useState("");
  const [paramDest, setParamDest] = useState(""); 
  const [iconDest, setIconDest] = useState("");
  const [deviceDest, setDeviceDest] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();

  const handleClick = () => {
    onClick();
  };

  const handleNameDest = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameDest(event.target.value);
  };
  const handleParamDest = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamDest(event.target.value);
  };

  const handleDeviceDest = (value: string) => {
    setDeviceDest(value);
  };

  const handleIconDest = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIconDest(event.target.value);
  };

  const handleCreateDest = () => {
    if (nameDest && paramDest && deviceDest) {
        setIsCreating(true); 
        wss?.sendMessage({  api: "admin",
        mt: "InsertButton",
        name: nameDest,
        value: paramDest,
        guid:  selectedUser?.guid,
        type: "dest",
        device: deviceDest,
        img: "megaphone", // consultar com danilo
        page: "0",
        x: clickedPosition?.j,
        y: clickedPosition?.i})
        setIsCreating(false)      
      } else {
        toast({
            variant: "destructive",
            description: "Por favor, preencha todos os campos antes de criar o botão.",
          });
      }
  }

  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-muted text-card-foreground shadow-sm p-1";

  switch (button.button_type) {
    case "dest":
      return (
        <div className={`${commonClasses} flex flex-col ${isClicked ? "bg-zinc-950" : ""}`} onClick={onClick}>
          <div className="flex items-center gap-1">
            {/* <Siren /> */}
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
          // <div>
          // {getDialogContent()}
          // </div>
          <Dialog>
            <DialogTrigger>
              <div
                className={`${commonClasses} flex items-center justify-center `}
                onClick={handleClick}
              >
                <Plus />
              </div>
            </DialogTrigger>
            {
              <DialogContent>
                <DialogHeader>
                  {clickedPosition && (
                    <p>
                      Clicked position: X: {clickedPosition.i}, Y:{" "}
                      {clickedPosition.j}
                    </p>
                  )}
                  <p>Usuário: {selectedUser?.name}</p>
                  <p>Página: {selectedPage}</p>
                </DialogHeader>
                nome do sensor parametro dispositivo icone
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-end" htmlFor="destName">
                    Nome do Atalho
                  </Label>
                  <Input
                    className="col-span-3"
                    id="destName"
                    placeholder="Nome do Atalho"
                    value={nameDest}
                    onChange={handleNameDest}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-end" htmlFor="paramDest">
                    Parâmetro
                  </Label>
                  <Input
                    className="col-span-3"
                    id="paramDest"
                    placeholder="Paramêtro"
                    value={paramDest}
                    onChange={handleParamDest}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-end" htmlFor="paramDest">
                    Dispositivo
                  </Label>
                  <Select value={deviceDest} onValueChange={handleDeviceDest}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Dispositivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Softphone">Softphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-end" htmlFor="paramDest">
                    Icone
                  </Label>
                  <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="megaphone"><Megaphone/></TabsTrigger>
                      <TabsTrigger value="siren"><Siren/></TabsTrigger>
                      <TabsTrigger value="waves"><Waves/></TabsTrigger>
                      <TabsTrigger value="home"><Home/></TabsTrigger>
                      <TabsTrigger value="zap"><Zap/></TabsTrigger>
                      <TabsTrigger value="hospital"><Hospital/></TabsTrigger>
                      <TabsTrigger value="flame"><Flame/></TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <DialogFooter>
                {!isCreating && (
            <Button onClick={handleCreateDest}>Criar Botão</Button>
          )}
          {isCreating && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criar Sensor
            </Button> 
          )}
                </DialogFooter>
              </DialogContent>
            }
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
