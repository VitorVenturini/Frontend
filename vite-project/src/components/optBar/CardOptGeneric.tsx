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

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface OptGenericProps {
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedOpt: string;
  existingButton?: ButtonInterface;
  isUpdate?: boolean;
}

export default function CardOptGeneric({
  clickedPosition,
  selectedUser,
  selectedOpt,
  existingButton,
  isUpdate = false,
}: OptGenericProps) {
  const [nameOpt, setNameOpt] = useState(existingButton?.button_name || "");
  const [valueOpt, setValueOpt] = useState(existingButton?.button_prt || "");
  const [fileContent, setFileContent] = useState<File | null>(null);
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const wss = useWebSocketData();

  const handleNameOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameOpt(event.target.value);
  };
  const handleValueOpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOpt(event.target.value);
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
              "x-auth": localStorage.getItem("token") || "",
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
        value: uploadedFileName || valueOpt,
        guid: selectedUser?.guid,
        img: null,
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
  const handleDeleteButton = () => {
    try {
      wss?.sendMessage({
        api: "admin",
        mt: "DeleteButtons",
        id: existingButton?.id,
      });
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
              />
            </div>
          )}
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
