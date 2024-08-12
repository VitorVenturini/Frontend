import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useWebSocketData } from "../../websocket/WebSocketProvider";
import { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "../../ui/use-toast";
import { usePbx, PbxInterface } from "./PbxContext";

// import * from React

export default function PbxConfigCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const wss = useWebSocketData();
  const { pbxInfo, setPbxInfo } = usePbx();

  const filteredPbxInfo = pbxInfo.filter((url) => {
    return url.entry === "urlPbxTableUsers";
  })[0];

  const [urlPbx, setUrlPbx] = useState(filteredPbxInfo?.value || "");

  const handleUrlPbx = (event: ChangeEvent<HTMLInputElement>) => {
    setUrlPbx(event.target.value);
  };

  const handleSendPbxUrl = () => {
    setIsLoading(true);
    if (urlPbx) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "urlPbxTableUsers",
        vl: urlPbx,
      });
      setPbxInfo([
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
    <Card className="w-[50%] h-fit">
      <CardHeader>
        <CardTitle>PBX</CardTitle>
        <CardDescription>Url do pbx</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 w-full">
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isLoading && <Button onClick={handleSendPbxUrl}>Salvar</Button>}
        {isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
