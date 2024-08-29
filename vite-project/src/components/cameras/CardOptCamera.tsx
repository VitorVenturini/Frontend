import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCameras } from "./CameraContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { Loader2 } from "lucide-react";
import { limitButtonName } from "../utils/utilityFunctions";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface OptCameraProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedOpt: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function CardOptCamera({
  clickedPosition,
  selectedUser,
  selectedOpt,
  existingButton,
  isUpdate = false,
  onClose,
}: OptCameraProps) {
  const [nameOpt, setNameOpt] = useState(existingButton?.button_name || "");
  const [modelCamera, setModelCamera] = useState(
    existingButton?.button_prt || ""
  );

  const [isCreating, setIsCreating] = useState(false);
  const { cameras } = useCameras();
  const { toast } = useToast();
  const wss = useWebSocketData();

  const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = limitButtonName(event.target.value);
    setNameOpt(name);
  };
  const handleModelCamera = (value: string) => {
    setModelCamera(value);
  };

  const handleCreateOpt = () => {
    if (nameOpt && modelCamera) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateButton" : "InsertButton",
        ...(isUpdate && { id: existingButton?.id }),
        name: nameOpt,
        value: modelCamera,
        guid: selectedUser?.guid,
        img: null,
        type: "camera",
        page: "0",
        x: clickedPosition?.j,
        y: clickedPosition?.i,
      });
      setIsCreating(false);
      onClose?.();
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
  };
  return (
    <>
      <Card className="border-none bg-transparent">
        {
          isUpdate && (
            <CardHeader>
              <CardTitle>Atualizar Botão Câmera</CardTitle>
              <CardDescription>
                Escolha um nome para o botão (de preferencia relacionado ao local
                onde a câmera está localizada) e escolha a câmera que voce deseja
                ver as imagens
              </CardDescription>
            </CardHeader>
          )
        }
        <CardContent className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Nome do botão
            </Label>
            <Input
              className="col-span-3"
              id="buttonName"
              placeholder="Nome do botão"
              value={nameOpt}
              onChange={handleNameOpt}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Selecione a Câmera
            </Label>
            <Select value={modelCamera} onValueChange={handleModelCamera}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma Câmera" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Câmeras</SelectLabel>
                  {cameras.map((cam) => (
                    <SelectItem
                      key={cam.id}
                      value={cam.mac}
                    >
                      {cam.nickname}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
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
                      Essa ação nao pode ser desfeita. Isso irá deletar
                      permanentemente o botão Câmera.
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
            <Button onClick={handleCreateOpt}>
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
      </Card>
    </>
  );
}
