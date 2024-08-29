import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Ghost } from "lucide-react";
import { ChangeEvent, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useAppConfig } from "./ConfigContext";
import ColumnsReports from "@/Reports/collumnsReports";
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

export default function LicenseCard() {
  const { licenseApi } = useAppConfig();
  const [licenseKey, setKey] = useState(licenseApi?.licenseFile.value || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [licenseInput, setLicense] = useState("");

  const licenseData = Object.entries(licenseApi.licenseActive).map(
    ([key, value]) => ({
      item: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza a primeira letra
      total: value.total,
      used: value.used,
    })
  );
  const keys = ["item", "used", "total"];
  const handleLicenseKey = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  // Envio da mensagem movido para dentro do useEffect
  useEffect(() => {
    wss?.sendMessage({
      api: "admin",
      mt: "ConfigLicense",
    });
  }, []); // Dependência vazia garante que isso só ocorre uma vez na montagem

  const saveKey = async () => {
    setIsLoading(true);
    console.log(`Nova Key: ${licenseKey}`);
    if (licenseKey === "") {
      toast({
        variant: "destructive",
        description: "Chave Vazia",
      });
    } else {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "licenseFile",
        vl: licenseKey,
      });
      toast({
        description: "Chave de Licença atualizada com sucesso",
      });
    }
    setIsLoading(false);
  };
  const restartService = async () => {
    setIsLoading2(true);
    wss?.sendMessage({
      api: "admin",
      mt: "RestartService",
    });
    toast({
      description: "Serviço reiniciado com sucesso",
    });
    setIsLoading2(false);
  };

  return (
    <Card className="min-w-[700px]">
      <CardHeader className="grid grid-cols-3 justify-between items-center">
        <CardTitle>Licenciamento</CardTitle>
        {!isLoading2 && (
          <div className="flex gap-4 justify-center">
            <AlertDialog>
            <AlertDialogTrigger>
            <Button variant={"destructive"}>
              Reiniciar Serviço
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ao apertar em confirmar toda as seções serão desconectadas
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={restartService}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
 
          </div>
        )}
        {isLoading2 && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 justify-between animate-spin" />
            Reiniciar
          </Button>
        )}
        {!isLoading && (
          <div className="flex gap-4 justify-end">
            <Button onClick={saveKey}>Salvar</Button>
          </div>
        )}
        {isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Token do sistema
            </h4>
            <p className="text-sm text-muted-foreground">
              {licenseApi.licenseKey.value}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h4 className="scroll-m-20 text-xl font-semibold basis-1/2">
                Chave de licença
              </h4>
              <Input
                type="text"
                id="key"
                placeholder="Chave de Licença"
                onChange={handleLicenseKey}
                value={licenseKey as string}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Data de instalação da licença
            </h4>
            <p className="text-sm text-muted-foreground">
              {licenseApi.licenseInstallDate}
            </p>
          </div>
          <div className="flex-col items-center justify-between gap-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Licenças
            </h4>
            <ColumnsReports
              data={licenseData}
              keys={keys}
              report={"Licenças disponíveis" as any}
              filter={""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
