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
import * as Icons from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  isClicked: boolean;
}

export default function DestComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedPage,
  isClicked,
}: DestProps) {
  const { isAdmin } = useContext(AccountContext);
  const [nameDest, setNameDest] = useState(button?.button_name || "");
  const [paramDest, setParamDest] = useState("");
  const [iconDest, setIconDest] = useState("");
  const [deviceDest, setDeviceDest] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();

  const handleClick = () => {
    onClick();
  };

  const handleNameDest = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 10) {
      toast({
        description: "deve ter menos de 10 caracteres",
      });
    } else {
      setNameDest(event.target.value);
    }
  };
  const handleParamDest = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamDest(event.target.value);
  };

  const handleDeviceDest = (value: string) => {
    setDeviceDest(value);
  };

  const handleIconDest = (newIcon: string) => {
    setIconDest(newIcon);
  };

  const handleCreateDest = () => {
    if (nameDest && paramDest && deviceDest) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: "InsertButton",
        name: nameDest,
        value: paramDest,
        guid: selectedUser?.guid,
        type: "dest",
        device: deviceDest,
        img: iconDest, // consultar com danilo
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

  const handleClickUpdate = () => {
    setIsUpdate(true);
    // Outras ações onClick aqui
  };

  const handleDeleteButton = () => {
    try {
      wss?.sendMessage({
        api: "admin",
        mt: "DeleteButtons",
        id: button?.id,
      });
    } catch (e) {
      console.error(e);
    }
    setNameDest("");
    setParamDest("");
    setIconDest("");
    setDeviceDest("");
    setIsCreating(false);
    setIsUpdate(false);

  };

  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-muted text-card-foreground shadow-sm p-1";

  // switch (button.button_type) {
  //   case "dest":
  //     let IconComponent = null;
  //     if (button.img && Icons[button.img as keyof typeof Icons]) {
  //       IconComponent = Icons[button.img as keyof typeof Icons];
  //     }
  //     return (
  //       <div className={`${commonClasses} flex flex-col items-center align-middle justify-center gap-1  ${isClicked ? "bg-zinc-950" : ""}`} onClick={onClick}>

  //         {IconComponent && <IconComponent />}
  //           <p className="text-sm font-medium leading-none">
  //             {button.button_name}
  //           </p>
  //         </div>

  //     );
  //   default:
  //     if (isAdmin) {
  //       return (
  //         // <div>
  //         // {getDialogContent()}
  //         // </div>
  //         <Dialog>
  //           <DialogTrigger>
  //             <div
  //               className={`${commonClasses} flex items-center justify-center `}
  //               onClick={handleClick}
  //             >
  //               <Plus />
  //             </div>
  //           </DialogTrigger>
  //           {
  //             <DialogContent>
  //               <DialogHeader>
  //                 {clickedPosition && (
  //                   <p>
  //                     Clicked position: X: {clickedPosition.i}, Y:{" "}
  //                     {clickedPosition.j}
  //                   </p>
  //                 )}
  //                 <p>Usuário: {selectedUser?.name}</p>
  //                 <p>Página: {selectedPage}</p>
  //               </DialogHeader>
  //               nome do sensor parametro dispositivo icone
  //               <div className="grid grid-cols-4 items-center gap-4">
  //                 <Label className="text-end" htmlFor="destName">
  //                   Nome do Atalho
  //                 </Label>
  //                 <Input
  //                   className="col-span-3"
  //                   id="destName"
  //                   placeholder="Nome do Atalho"
  //                   value={nameDest}
  //                   onChange={handleNameDest}
  //                   required
  //                 />
  //               </div>
  //               <div className="grid grid-cols-4 items-center gap-4">
  //                 <Label className="text-end" htmlFor="paramDest">
  //                   Parâmetro
  //                 </Label>
  //                 <Input
  //                   className="col-span-3"
  //                   id="paramDest"
  //                   placeholder="Paramêtro"
  //                   value={paramDest}
  //                   onChange={handleParamDest}
  //                   required
  //                 />
  //               </div>
  //               <div className="grid grid-cols-4 items-center gap-4">
  //                 <Label className="text-end" htmlFor="paramDest">
  //                   Dispositivo
  //                 </Label>
  //                 <Select value={deviceDest} onValueChange={handleDeviceDest}>
  //                   <SelectTrigger className="w-[180px]">
  //                     <SelectValue placeholder="Dispositivo" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="Softphone">Softphone</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <div className="grid grid-cols-4 items-center gap-4">
  //                 <Label className="text-end" htmlFor="paramDest">
  //                   Icone
  //                 </Label>
  //                 <Tabs  className="w-[400px]" onValueChange={handleIconDest} >
  //                   <TabsList>
  //                     <TabsTrigger value="Megaphone"><Megaphone/></TabsTrigger>
  //                     <TabsTrigger value="Siren"><Siren/></TabsTrigger>
  //                     <TabsTrigger value="Waves"><Waves/></TabsTrigger>
  //                     <TabsTrigger value="Home"><Home/></TabsTrigger>
  //                     <TabsTrigger value="Zap"><Zap/></TabsTrigger>
  //                     <TabsTrigger value="Hospital"><Hospital/></TabsTrigger>
  //                     <TabsTrigger value="Flame"><Flame/></TabsTrigger>
  //                   </TabsList>
  //                 </Tabs>
  //               </div>
  //               <DialogFooter>
  //               {!isCreating && (
  //           <Button onClick={handleCreateDest}>Criar Botão</Button>
  //         )}
  //         {isCreating && (
  //           <Button disabled>
  //             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //             Criar Sensor
  //           </Button>
  //         )}
  //               </DialogFooter>
  //             </DialogContent>
  //           }
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
  const getDialogContent = () => {
    return (
      <>
        <DialogHeader>{isUpdate ? "Atualizar" : "Criar"} Botão</DialogHeader>
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
          <Tabs className="w-[400px]" onValueChange={handleIconDest}>
            <TabsList>
              <TabsTrigger value="Megaphone">
                <Megaphone />
              </TabsTrigger>
              <TabsTrigger value="Siren">
                <Siren />
              </TabsTrigger>
              <TabsTrigger value="Waves">
                <Waves />
              </TabsTrigger>
              <TabsTrigger value="Home">
                <Home />
              </TabsTrigger>
              <TabsTrigger value="Zap">
                <Zap />
              </TabsTrigger>
              <TabsTrigger value="Hospital">
                <Hospital />
              </TabsTrigger>
              <TabsTrigger value="Flame">
                <Flame />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DialogFooter className="flex justify-between">
          {isUpdate && (
            <Button variant="secondary">
              <AlertDialog>
                <AlertDialogTrigger className="w-full h-full">
                  Excluir
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação nao pode ser desfeita. Isso irá deletar
                      permanentemente o botão Sensor.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteButton}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
          )}
          {!isCreating && (
            <Button onClick={handleCreateDest}>
              {isUpdate ? "Atualizar" : "Criar"} Botão
            </Button>
          )}
          {isCreating && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUpdate ? "Atualizar" : "Criar"} Botão
            </Button>
          )}
        </DialogFooter>
      </>
    );
  };

  const renderButtonContent = () => {
    if (!button.button_type) {
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
            <DialogContent>{getDialogContent()}</DialogContent>
          </Dialog>
        );
      } else {
        return (
          <div
            className={`${commonClasses} flex items-center justify-center`}
          ></div>
        );
      }
    } else if (button.button_type === "dest") {
      let IconComponent = null;
      if (button.img && Icons[button.img as keyof typeof Icons]) {
        IconComponent = Icons[button.img as keyof typeof Icons];
      }
      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <div
                className={`${commonClasses} flex flex-col items-center align-middle justify-center gap-1  ${
                  isClicked ? "bg-zinc-950" : ""
                }`}
                onClick={handleClickUpdate}
              >
                {IconComponent && <IconComponent />}
                <p className="text-sm font-medium leading-none">
                  {button.button_name}
                </p>
              </div>
            </DialogTrigger>
            {isAdmin && (
              <div>
                <DialogContent>{getDialogContent()}</DialogContent>
              </div>
            )}
          </Dialog>
        </div>
      );
    }
    // switch (button.button_type) {
    //   case "dest":
    //     let IconComponent = null;
    //     if (button.img && Icons[button.img as keyof typeof Icons]) {
    //       IconComponent = Icons[button.img as keyof typeof Icons];
    //     }
    //     return (
    //       <div>
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <div
    //             className={`${commonClasses} flex flex-col items-center align-middle justify-center gap-1  ${
    //               isClicked ? "bg-zinc-950" : ""
    //             }`}
    //             onClick={handleClickUpdate}
    //           >
    //             {IconComponent && <IconComponent />}
    //             <p className="text-sm font-medium leading-none">
    //               {button.button_name}
    //             </p>
    //           </div>
    //         </DialogTrigger>
    //         {isAdmin && (
    //           <div>
    //             <DialogContent>{getDialogContent()}</DialogContent>
    //           </div>
    //         )}
    //       </Dialog>
    //       </div>
    //     );
    //   default:
    //     if (isAdmin) {
    //       return (
    //         // <div>
    //         // {getDialogContent()}
    //         // </div>
    //         <Dialog>
    //           <DialogTrigger>
    //             <div
    //               className={`${commonClasses} flex items-center justify-center `}
    //               onClick={handleClick}
    //             >
    //               <Plus />
    //             </div>
    //           </DialogTrigger>
    //           <DialogContent>{getDialogContent()}</DialogContent>
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
  };

  return renderButtonContent();
}
