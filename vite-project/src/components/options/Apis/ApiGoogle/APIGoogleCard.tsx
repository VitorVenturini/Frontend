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
import { GoogleApiKeyInterface, useAppConfig } from "../../ConfigContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
// import * from React

export default function APIGoogleCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { setGoogleApiKeyConfig, googleApiKeyInfo } = useAppConfig();

  console.log("APIGoogle", googleApiKeyInfo);
  const [key, setKey] = useState(
    googleApiKeyInfo.googleAPIMapsKey?.value || ""
  );

  const handleApiKey = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };
  const handleSendGoogleApiKey = () => {
    setIsLoading(true);
    if (key) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "googleApiKey",
        vl: key,
      });

      // adicionar no contexto caso o admin troca de aba para manter o valor no input
      // pois so consultamos o valor da chave google quando ele loga no app , nao quando ele fizer alterações
      toast({
        description: "Chave cadastrada com Sucesso!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Favor Inserir a chave da API Google",
      });
    }
    setIsLoading(false);
  };
  return (
    <Card className="w-[50%] h-fit">
      <CardHeader>
        <CardTitle>{texts[language].googleMapsTitle}</CardTitle>
        <CardDescription>{texts[language].googleMapsLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="grid grid-cols-4 items-center justify-between gap-3 w-full">
            <h4 className="scroll-m-20 col-span-1 text-xl text-end font-semibold tracking-tight">
              {texts[language].key}
            </h4>
            <Input
              className="w-full col-span-3"
              onChange={handleApiKey}
              value={key}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isLoading && (
          <Button onClick={handleSendGoogleApiKey}>
            {texts[language].save}
          </Button>
        )}
        {isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {texts[language].save}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
export function APIGoogleCalendarCard() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setGoogleApiKeyConfig, googleApiKeyInfo } = useAppConfig();

  const [apiGoogleStatus, setGoogleStatus] = useState<boolean>(
    googleApiKeyInfo?.googleApiStatus || false
  );

  const [keyID, setKeyID] = useState(
    googleApiKeyInfo?.googleAPICalendarKey?.value || ""
  );
  const [keySecret, setKeySecret] = useState(
    googleApiKeyInfo?.googleAPICalendarSecret?.value || ""
  );

  // Sincroniza o estado local com o contexto
  useEffect(() => {
    setGoogleStatus(googleApiKeyInfo?.googleApiStatus || false);
  }, [googleApiKeyInfo.googleApiStatus]);

  const handleGoogleApiOAuthRequest = () => {
    //setIsChecking(true);
    if(!apiGoogleStatus){
      wss?.sendMessage({
        api: "admin",
        mt: "RequestGoogleOAuth",
      });
    }else{
      wss?.sendMessage({
        api: "admin",
        mt: "RequestGoogleOAuthRemove",
      });
    }
  };

  const handleSendGoogleApiKey = () => {
    if (keyID && keySecret) {
      setIsLoading(true);
    if (keySecret && keyID) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigGoogleCalendar",
        googleClientId: keyID,
        googleClientSecret: keySecret
      });
      toast({
        description: "Chave cadastrada com Sucesso!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Favor Inserir a chave da API Google",
      });
    }
    setIsLoading(false);
    }
  };
  return (
    <Card className="w-[50%] h-fit">
      <CardHeader>
        <CardTitle>{texts[language].googleCalendarTitle}</CardTitle>
        <CardDescription>{texts[language].googleCalendarLabel}</CardDescription>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <h4 className="scroll-m-20 columns-1 text-end text-xl font-semibold tracking-tight">
              {texts[language].status}
            </h4>
            {apiGoogleStatus ? (
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
            <Button onClick={handleGoogleApiOAuthRequest}>
              {apiGoogleStatus ? texts[language].authorized : texts[language].not_authorized}
            </Button>
          )}
          {isLoading && (
            <Button disabled>
              {apiGoogleStatus ? texts[language].authorized : texts[language].not_authorized}
            </Button>
          )}
        </div>
        <div>
          {!isLoading && (
            <Button onClick={handleSendGoogleApiKey}>
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

export function APIGoogleCalendarCard2() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { setGoogleApiKeyConfig, googleApiKeyInfo } = useAppConfig();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [apiGoogleStatus, setGoogleStatus] = useState<boolean>(
    googleApiKeyInfo?.googleApiStatus || false
  );
  const [keyID, setKeyID] = useState(
    googleApiKeyInfo?.googleAPICalendarKey?.value || ""
  );
  const [keySecret, setkeySecret] = useState<string>(
    googleApiKeyInfo?.googleAPICalendarSecret?.value || ""
  );
  const handleApiKeyID = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyID(event.target.value);
  };
  const handleApiKeySecret = (event: ChangeEvent<HTMLInputElement>) => {
    setkeySecret(event.target.value);
  };
  const handleGoogleApiOAuthRequest = () => {
    //setIsChecking(true);
    wss?.sendMessage({
      api: "admin",
      mt: "RequestGoogleOAuth",
    });
  };
  const handleSendGoogleApiKey = () => {
    setIsLoading(true);
    if (keySecret && keyID) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigGoogleCalendar",
        googleClientId: keyID,
        googleClientSecret: keySecret
      });
      toast({
        description: "Chave cadastrada com Sucesso!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Favor Inserir a chave da API Google",
      });
    }
    setIsLoading(false);
  };
  return (
    <Card className="w-[50%] h-fit">
      <CardHeader>
        <CardTitle>{texts[language].googleCalendarTitle}</CardTitle>
        <CardDescription>{texts[language].googleCalendarLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="items-center justify-between gap-3 w-full grid grid-cols-4">
            <h4 className="scroll-m-20 text-end text-xl font-semibold tracking-tight col-span-1">
              {texts[language].keyID}
            </h4>
            <Input
              className="w-full  col-span-3"
              onChange={handleApiKeyID}
              value={keyID}
            />
          </div>
          <div className="grid grid-cols-4 text-end items-center justify-between gap-3 w-full">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight col-span-1">
              {texts[language].keySecret}
            </h4>
            <Input
              className="w-full col-span-3"
              onChange={handleApiKeySecret}
              value={keySecret}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <h4 className="scroll-m-20 columns-1 text-end text-xl font-semibold tracking-tight">
              {texts[language].status}
            </h4>
            {apiGoogleStatus ? (
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
            <Button onClick={handleGoogleApiOAuthRequest}>
              {texts[language].checking}
            </Button>
          )}
          {isLoading && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {texts[language].checking}
            </Button>
          )}
        </div>
        <div>
          {!isLoading && (
            <Button onClick={handleSendGoogleApiKey}>
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
