import {
    ButtonInterface,
  } from "@/components/buttons/buttonContext/ButtonsContext";
  import React, { useState } from "react";
  import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { useToast } from "@/components/ui/use-toast";
  import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Loader2 } from "lucide-react";
  
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
    Megaphone,
    Home,
    Zap,
    Waves,
    User,
    Hospital,
    Flame,
    Siren,
  } from "lucide-react";
  import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
  
  interface User {
    id: string;
    name: string;
    guid: string;
  }
  
  interface ButtonDestProps {
    clickedPosition: { i: number; j: number } | null;
    selectedUser: User | null;
    selectedPage: string;
    existingButton?: ButtonInterface;
    isUpdate?: boolean;
    onClose?: () => void;
  }
  
  export default function ModalNumber({
    selectedUser,
    selectedPage,
    clickedPosition,
    existingButton,
    onClose,
    isUpdate = false,
  }: ButtonDestProps) {
    const [nameButton, setNameButton] = useState(existingButton?.button_name || "");
    const [paramButton, setParamButton] = useState(existingButton?.button_prt || "");
    const [iconButton, setIconButton] = useState(existingButton?.img || "");
    const [deviceButton, setDeviceButton] = useState(
      existingButton?.button_device || ""
    );
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();
    const wss = useWebSocketData();
  
    const handleNameButton = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNameButton(event.target.value);
    };
    const handleParamButton = (event: React.ChangeEvent<HTMLInputElement>) => {
      setParamButton(event.target.value);
    };
  
    const handleDeviceButton = (value: string) => {
      setDeviceButton(value);
    };
  
    const handleIconButton = (newIcon: string) => {
      setIconButton(newIcon);
    };
  
    const handleCreateDest = () => {
      if (nameButton && paramButton && deviceButton) {
        setIsCreating(true);
        wss?.sendMessage({
          api: "admin",
          mt: isUpdate ? "UpdateButton" : "InsertButton",
          ...(isUpdate && { id: existingButton?.id }),
          name: nameButton,
          value: paramButton,
          guid: selectedUser?.guid,
          type: "number",
          device: deviceButton,
          img: iconButton,
          page: selectedPage,
          x: clickedPosition?.j,
          y: clickedPosition?.i,
        });
        onClose?.()
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
        onClose?.()
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
    return (
      <>
        {isUpdate && (
          <CardHeader>
            <CardTitle>
              {isUpdate ? "Atualização" : "Criação"} de Botões de Ligação
            </CardTitle>
            <CardDescription>
              Para {isUpdate ? "atualizar" : "criar"} um botão de ligação complete
              os campos abaixo
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-5 items-center gap-4 mt-3 mb-3">
            <Label className="text-end" htmlFor="destName">
              Nome do Botão
            </Label>
            <Input
              className="col-span-4"
              id="destName"
              placeholder="Nome do Botão"
              value={nameButton}
              onChange={handleNameButton}
              required
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4 mb-3">
            <Label className="text-end" htmlFor="paramDest">
              Número 
            </Label>
            <Input
              className="col-span-4"
              id="paramDest"
              placeholder="Número"
              value={paramButton}
              onChange={handleParamButton}
              required
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4 mb-3">
            <Label className="text-end" htmlFor="paramDest">
              Dispositivo
            </Label>
            <Select value={deviceButton} onValueChange={handleDeviceButton}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Softphone">Softphone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-5 items-center gap-4 mb-3">
            <Label className="text-end" htmlFor="paramDest">
              Ícone
            </Label>
            <Tabs
              className="col-span-4"
              onValueChange={handleIconButton}
              value={iconButton}
            >
              <TabsList>
                <TabsTrigger value="Megaphone">
                  <Megaphone size={iconSize} />
                </TabsTrigger>
                <TabsTrigger value="Siren">
                  <Siren size={iconSize} />
                </TabsTrigger>
                <TabsTrigger value="Waves">
                  <Waves size={iconSize} />
                </TabsTrigger>
                <TabsTrigger value="Home">
                  <Home size={iconSize} />
                </TabsTrigger>
                <TabsTrigger value="Zap">
                  <Zap size={iconSize} />
                </TabsTrigger>
                <TabsTrigger value="Hospital">
                  <Hospital size={iconSize} />
                </TabsTrigger>
                <TabsTrigger value="Flame">
                  <Flame size={iconSize} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardFooter className="flex justify-between">
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
                        Essa ação não pode ser desfeita. Isso irá deletar
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
          </CardFooter>
        </CardContent>
      </>
    );
  }
  
  