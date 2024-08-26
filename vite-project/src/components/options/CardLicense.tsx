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

export default function LicenseCard() {
  const [licenseKey, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [licenseInput, setLicense] = useState("");
  const { licenseApi } = useAppConfig();

  console.log("LICENSE API", licenseApi);
  const licenseData = Object.entries(licenseApi.licenseActive).map(([key, value]) => ({
    item: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza a primeira letra
    total: value.total,
    used: value.used,
  }));
  const keys = ['item', 'used', 'total']

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
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateLicense",
        licenseFile: licenseInput,
      });
      toast({
        variant: "destructive",
        description: "Chave Vazia",
      });
    } else {
      toast({
        description: "Chave de Licença atualizada com sucesso",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="min-w-[700px]">
      <CardHeader className="flex-row align-middle justify-between items-center">
        <CardTitle>Licenciamento</CardTitle>
        {!isLoading && <Button onClick={saveKey}>Salvar</Button>}
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
                value={licenseApi.licenseFile.value}
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
              report={'Licenças disponíveis' as any}
              filter = {''}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
