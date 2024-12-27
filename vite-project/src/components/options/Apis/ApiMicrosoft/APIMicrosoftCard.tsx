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
import { MicrosoftApiKeyInterface, useAppConfig } from "../../ConfigContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
// import * from React

export default function APIMicrosoftCalendarCard() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setMicrosoftApiKeyConfig, microsoftApiKeyInfo } = useAppConfig();

  const [microsoftApiStatus, setMicrosoftStatus] = useState<boolean>(
    microsoftApiKeyInfo?.microsoftApiStatus || false
  );

  const [keyID, setKeyID] = useState(
    microsoftApiKeyInfo?.microsoftAPICalendarKey?.value || ""
  );
  const [keySecret, setKeySecret] = useState(
    microsoftApiKeyInfo?.microsoftAPICalendarSecret?.value || ""
  );
  const [keyTenant, setKeyTenant] = useState(
    microsoftApiKeyInfo?.microsoftAPICalendarTenant?.value || ""
  );

  // Sincroniza o estado local com o contexto
  useEffect(() => {
    setMicrosoftStatus(microsoftApiKeyInfo?.microsoftApiStatus || false);
  }, [microsoftApiKeyInfo.microsoftApiStatus ]);

  const handleMicrosoftApiOAuthRequest = () => {
    //setIsChecking(true);
    if(!microsoftApiStatus){
      wss?.sendMessage({
        api: "admin",
        mt: "RequestMicrosoftOAuth",
      });
    }else{
      wss?.sendMessage({
        api: "admin",
        mt: "RequestMicrosoftOAuthRemove",
      });
    }
  };

  const handleSendMicrosoftApiKey = () => {
    if (keyID && keySecret) {
      setIsLoading(true);
    if (keySecret && keyID) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigMicrosoftCalendar",
        googleClientId: keyID,
        googleClientSecret: keySecret
      });
      toast({
        description: "Chave cadastrada com Sucesso!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Favor Inserir a chave da API",
      });
    }
    setIsLoading(false);
    }
  };
  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle>{texts[language].microsoftCalendarTitle}</CardTitle>
        <CardDescription>{texts[language].microsoftCalendarLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="items-center justify-between gap-3 w-full grid grid-cols-4">
            <h4 className="scroll-m-20 text-end text-xl font-semibold tracking-tight col-span-1">
              {texts[language].keyID}
            </h4>
            <Input
              className="w-full  col-span-3"
              value={keyID}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyID(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 text-end items-center justify-between gap-3 w-full">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight col-span-1">
              {texts[language].keySecret}
            </h4>
            <Input
              className="w-full col-span-3"
              value={keySecret}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setKeySecret(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 text-end items-center justify-between gap-3 w-full">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight col-span-1">
              {texts[language].keyTenant}
            </h4>
            <Input
              className="w-full col-span-3"
              value={keyTenant}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyTenant(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <h4 className="scroll-m-20 columns-1 text-end text-xl font-semibold tracking-tight">
              {texts[language].status}
            </h4>
            {microsoftApiStatus ? (
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            ) : (
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            )} 
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <div>
          {!isLoading && (
            <Button onClick={handleMicrosoftApiOAuthRequest}>
              {microsoftApiStatus ? texts[language].authorized : texts[language].not_authorized}
            </Button>
          )}
          {isLoading && (
            <Button disabled>
              {microsoftApiStatus ? texts[language].authorized : texts[language].not_authorized}
            </Button>
          )}
        </div>
        <div>
          {!isLoading && (
            <Button onClick={handleSendMicrosoftApiKey}>
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
      </CardFooter>
    </Card>
  );
}
