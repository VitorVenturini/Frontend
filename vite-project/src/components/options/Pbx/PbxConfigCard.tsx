import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useWebSocketData } from "../../websocket/WebSocketProvider";
import { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "../../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PbxInterface, useAppConfig } from "../ConfigContext";

// import * from React

export default function PbxConfigCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { pbxStatus, setPbxStatus, addPbx } = useAppConfig();

  const filteredPbxInfo = pbxStatus.filter((url) => {
    return url.entry === "urlPbxTableUsers";
  })[0];
  const filteredPbxType = pbxStatus.filter((url) => {
    return url.entry === "pbxType";
  })[0];
  const [selectPbx, setSelectPbx] = useState(
    filteredPbxType?.value?.toUpperCase() || ""
  );
  const [urlPbx, setUrlPbx] = useState(filteredPbxInfo?.value || "");

  console.log("PBXCONFIG", pbxStatus);
  const handleUrlPbx = (event: ChangeEvent<HTMLInputElement>) => {
    setUrlPbx(event.target.value);
  };
  const handleSelect = (value: string) => {
    setSelectPbx(value);
  };
  useEffect(() => {
    wss?.sendMessage({
      api: "admin",
      mt: "PbxStatus",
    });
    wss?.sendMessage({
      api: "admin",
      mt: "TableUsers",
    });
  }, []);

  const handleSendPbxUrl = () => {
    setIsLoading(true);
    if (urlPbx) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "pbxType",
        vl: selectPbx,
      });
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "urlPbxTableUsers",
        vl: urlPbx,
      });
      setPbxStatus([
        {
          entry: "urlPbxTableUsers",
          value: urlPbx,
        },
      ] as PbxInterface[]);
      // adicionar no contexto caso o admin troca de aba para manter o valor no input
      // pois so consultamos o valor da pbx api quando ele loga no app , nao quando ele fizer alterações
      toast({
        description: "Url cadastrada com Sucesso!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Favor Inserir a Url do PBX",
      });
    }
    setIsLoading(false);
  };
  return (
    <Card className="">
      <CardHeader>
        <div className="flex align-middle justify-between items-center">
          <CardTitle>PBX</CardTitle>

          {!isLoading && <Button onClick={handleSendPbxUrl}>Salvar</Button>}
          {isLoading && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvar
            </Button>
          )}
        </div>
        <CardDescription>Modelo e URL do pbx</CardDescription>
      </CardHeader>
      <CardContent className="grid w-full items-center gap-6">
        <div className="w-full flex flex-col gap-5">
          <div className="grid grid-cols-2 items-center gap-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Modelo
            </h4>
            <Select onValueChange={handleSelect} value={selectPbx}>
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="Selecione um PBX" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>PBX</SelectLabel>

                  <SelectItem value={"INNOVAPHONE"}>Innovaphone</SelectItem>
                  <SelectItem value={"EPYGI"}>Epygi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              URL
            </h4>
            <Input
              type="url"
              placeholder="URL"
              className="w-full"
              onChange={handleUrlPbx}
              value={urlPbx}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight ">
              Status
            </h4>
            {pbxStatus[0]?.status === "200" ? (
              <div className="flex items-center gap-1 justify-end">
                <h4>Online</h4>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </div>
            ) : (
              <div className="flex items-center gap-1 justify-end">
                <h4>Offline</h4>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
