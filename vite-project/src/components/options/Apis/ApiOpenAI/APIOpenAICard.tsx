import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "../../../ui/input";
import { useEffect, useState } from "react";
import { useWebSocketData } from "../../../websocket/WebSocketProvider";
import React, { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast, useToast } from "../../../ui/use-toast";
import {
  GoogleApiKeyInterface,
  OpenAIApiKeyInterface,
  useAppConfig,
} from "../../ConfigContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Label } from "@/components/ui/label";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

export default function APIOpenAICard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { openAIApiConfig } = useAppConfig();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [apiOpenAI, setApiOpenAI] = useState<boolean>(false);
  const [openAIKey, setKey] = useState<string>(
    openAIApiConfig?.openaiKey?.value || ""
  );
  const [openAIOrg, setOrg] = useState<string>(
    openAIApiConfig?.openaiOrg?.value || ""
  );
  const [openAIProj, setProj] = useState<string>(
    openAIApiConfig?.openaiProj?.value || ""
  );
  useEffect(() => {
    console.log("OpenAI Contex", openAIApiConfig.openaiKey);
    if (openAIApiConfig?.openaiKey?.status === true) {
      setApiOpenAI(true);
      setIsChecking(false);
      console.log("VERIF OpenAI OK", apiOpenAI);
    } else if (openAIApiConfig?.openaiKey?.status === false) {
      setApiOpenAI(false);
      setIsChecking(false);
      console.log("VERIF OpenAI OFF", apiOpenAI);
    }
  }, [openAIApiConfig?.openaiKey?.status, apiOpenAI]); // Atualiza somente quando o status muda

  const handleCheckStatus = () => {
    setIsChecking(true);
    setApiOpenAI(false);
    wss?.sendMessage({
      api: "admin",
      mt: "GetOpenAiStatus",
    });
  };

  const handleApiKey = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const handleApiOrg = (event: ChangeEvent<HTMLInputElement>) => {
    setOrg(event.target.value);
  };

  const handleApiProj = (event: ChangeEvent<HTMLInputElement>) => {
    setProj(event.target.value);
  };

  const handleSendOpenAIValues = () => {
    setIsLoading(true);
    if (openAIKey && openAIOrg && openAIProj) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigOpenAI",
        openaiKey: openAIKey,
        openaiOrg: openAIOrg,
        openaiProj: openAIProj,
      });
      setIsLoading(false);
      // adicionar no contexto caso o admin troca de aba para manter o valor no input
      // pois so consultamos o valor da chave quando ele loga no app ou altera, nao quando ele fizer alterações
      toast({
        description: "Chave cadastrada com Sucesso!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Favor Inserir os valores da API",
      });
    }
    setIsLoading(false);
  };
  return (
    <Card className="w-[50%] h-fit">
      <CardHeader>
        <CardTitle>{texts[language].openAiCardTitle}</CardTitle>
        <CardDescription>{texts[language].openAiCardLabel}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 py-9">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            {texts[language].key}
          </Label>
          <Input
            className="col-span-3"
            onChange={handleApiKey}
            value={openAIKey}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            {texts[language].organization}
          </Label>
          <Input
            className="col-span-3"
            onChange={handleApiOrg}
            value={openAIOrg}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            {texts[language].project}
          </Label>
          <Input
            className="col-span-3"
            onChange={handleApiProj}
            value={openAIProj}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            {texts[language].status}
          </Label>
          {apiOpenAI ? (
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500" title=""></span>
          ) : !isChecking ? (
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gray-500"></span>
          ) : (
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="flex justify-between w-full">
          <div>
            {!isChecking && (
              <AlertDialog>
                <AlertDialogTrigger>
                  {isChecked === true && (
                    <Button>{texts[language].checking}</Button>
                  )}
                  {!isChecked && (
                    <Button variant="secondary">
                      {texts[language].checking}
                    </Button>
                  )}
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <div className="flex items-stretch flex-col justify-between h-[160px]">
                    <div className="text-center">
                      {texts[language].costWarning}
                    </div>
                    <div className="flex-col justify-center text-center f">
                      {texts[language].areYouSure}
                    </div>
                    <div className="flex justify-between">
                      <AlertDialogCancel>
                        {texts[language].cancel}
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleCheckStatus}>
                        {texts[language].labelConfirm}
                      </AlertDialogAction>
                    </div>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {isChecking && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {texts[language].checking}
              </Button>
            )}
          </div>
          <div>
            {!isLoading && (
              <Button onClick={handleSendOpenAIValues}>
                {texts[language].save}
              </Button>
            )}
            {isLoading && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {texts[language].save}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
