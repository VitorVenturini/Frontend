import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSensors } from "../sensor/SensorContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { host } from "@/App";
import { useAccount } from "../account/AccountContext";
import { limitButtonName } from "../utils/utilityFunctions";
import { UserInterface } from "../users/usersCore/UserContext";

interface OptGenericProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedOpt: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
  onClose?: () => void;
}

export default function CardOptGeneric({
  clickedPosition,
  selectedUser,
  selectedOpt,
  existingButton,
  onClose,
  isUpdate = false,
}: OptGenericProps) {
  
 const coordinates = selectedOpt === "maps" ? existingButton?.button_prt.split(",") : "";
 // tratamento adicional para pegar o button_prt e separar os valores de 
 // latitude e longitude

  const [nameOpt, setNameOpt] = useState(existingButton?.button_name || "");
  const [valueOpt, setValueOpt] = useState(coordinates ? coordinates?.[0] : existingButton?.button_prt || "" );
  // value opt é o primeiro input de todos os cards , nesse caso reaproveitamos ele para armazenar a latitude
  // e entao concatenar com longitude
  const [longitudeMaps, setLongitude] = useState(coordinates?.[1] || "");
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [userToChat, setUserToChat] = useState("");
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const account = useAccount();
  const wss = useWebSocketData();


  const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const limitedName = limitButtonName(event.target.value);
    setNameOpt(limitedName);
  };
  const handleValueOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOpt(event.target.value);
  };

  const handleLongitude = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(event.target.value);
  };
  const handleUserToChat = (value: string) => {
    setUserToChat(value);
  };
  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileContent(file);
    }
    console.log("File" + JSON.stringify(file?.name));
  };

  // const handleSendImage = async (): Promise<string | null> => {
  //   if (!fileContent) return null;
  //   console.log("Imagem" + JSON.stringify(fileContent));

  // };
  const handleCreateOpt = async () => {
    if (nameOpt && (valueOpt || fileContent)) {
      setIsCreating(true);

      let uploadedFileName: string | null = null;

      if (fileContent) {
        try {
          const formData = new FormData();
          formData.append("file", fileContent);

          const response = await fetch(host + "/api/uploadFiles", {
            method: "POST",
            headers: {
              "x-auth": account.accessToken || "",
            },
            body: formData,
          });

          const data = await response.json();

          if (response.ok) {
            uploadedFileName = data.fileUrl;
          } else {
            console.error("Erro ao enviar a imagem", data);
          }
        } catch (error) {
          console.error("Erro ao enviar a imagem", error);
        }
      }
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateButton" : "InsertButton",
        ...(isUpdate && { id: existingButton?.id }),
        name: nameOpt,
        value: selectedOpt === "maps" ? valueOpt + "," +  longitudeMaps  : uploadedFileName || valueOpt,
        guid: selectedUser?.guid,
        img: null,
        type: selectedOpt,
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

  const getContent = () => {
    switch (selectedOpt) {
      case "floor":
        return {
          title: "Botão Planta Baixa",
          description: "Descrição para botão Planta Baixa",
          labelButton: "Arquivo ",
          IptType: "file",
          onChangeFunction: handleUploadFile,
        };
      case "maps":
        return {
          title: "Botão Mapa",
          description: "Descrição para botão Mapa",
          labelButton: "Latitude ",
          labelButton2: "Longitude ",
          IptType: "text",
          onChangeFunction: handleValueOpt,
        };
      case "video":
        return {
          title: "Botão Video",
          description: "Descrição para botão Video",
          labelButton: "Link do Vídeo ",
          IptType: "text",
          onChangeFunction: handleValueOpt,
        };
      case "chat":
        return {
          title: "Botão Chat",
          description: "Descrição para botão Chat aqui",
          labelButton: "Selecione o Usuario ",
          // IptType: "text",
          // onChangeFunction: handleUserToChat,
        };
      default:
        return { title: "um botão", description: "" };
    }
  };

  const {
    title,
    description,
    labelButton,
    labelButton2,
    IptType,
    onChangeFunction,
  } = getContent();

  return (
    <>
      <Card className="border-none bg-transparent">
        <CardHeader>
          <CardTitle>
            {isUpdate ? "Atualizar" : "Criar"} {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
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
          {selectedOpt === "chat" ? (
            "Inputchat aqui"
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-end" htmlFor="buttonName">
                {labelButton}
              </Label>
              <Input
                className="col-span-3"
                id="buttonName"
                placeholder={labelButton}
                value={selectedOpt === "floor" ? undefined : valueOpt}
                onChange={onChangeFunction}
                type={IptType}
                required
              />
            </div>
          )}

          {selectedOpt === "floor" && valueOpt ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-end" htmlFor="buttonName">
                Valor Atual
              </Label>
              <Input
                className="col-span-3"
                id="buttonName"
                placeholder={labelButton}
                value={fileContent ? fileContent.name : valueOpt}
                readOnly
                type="text"
                required
              />
            </div>
          ) : (
            ""
          )}
          {selectedOpt === "maps" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-end" htmlFor="buttonName">
                Longitude
              </Label>
              <Input
                className="col-span-3"
                id="buttonName"
                placeholder={labelButton2}
                type="text"
                required
                onChange={handleLongitude}
                value={longitudeMaps}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end w-full">
          {isUpdate && (
            <div className="flex w-full justify-between">
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
                      permanentemente o botão.
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
            </div>

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
