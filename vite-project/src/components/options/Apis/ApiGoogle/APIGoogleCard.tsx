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
import { useState } from "react";
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
  const { setGoogleApiKeyInfo, googleApiKeyInfo } = useAppConfig();

  console.log("APIGoogle", googleApiKeyInfo);
  const [key, setKey] = useState(
    googleApiKeyInfo.googleAPIMapsKey?.value || ""
  );

  const handleApiKey = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const { googleAPIMapsKey, googleAPICalendarKey, googleAPICalendarSecret } =
    googleApiKeyInfo;

  // Verifica e pega o valor de cada chave individualmente
  const googleMapsApiKey =
    googleAPIMapsKey?.entry === "googleApiKey" ? googleAPIMapsKey.value : null;
  const googleCalendarApiKey =
    googleAPICalendarKey?.entry === "googleClientId"
      ? googleAPICalendarKey.value
      : null;
  const googleCalendarSecret =
    googleAPICalendarSecret?.entry === "googleClientSecret"
      ? googleAPICalendarSecret.value
      : null;

  console.log("Google Maps API Key:", googleMapsApiKey);
  console.log("Google Calendar API Key:", googleCalendarApiKey);
  console.log("Google Calendar Secret:", googleCalendarSecret);

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
export function APIGMAILGoogleCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { setGoogleApiKeyInfo, googleApiKeyInfo } = useAppConfig();
  const [isChecking, setIsChecking] = useState<boolean>(false);
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
    setKeyID(event.target.value);
  };
  const handleGoogleApiStatus = () => {
    setIsChecking(true);
    setGoogleStatus(false);
    wss?.sendMessage({
      api: "admin",
      mt: "RequestGoogleOAuthStatus",
    });
  };
  const handleSendGoogleApiKey = () => {
    setIsLoading(true);
    if (keyID) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigGoogleCalendar",
        googleClientID: keyID,
      });
      // adicionar no contexto caso o admin troca de aba para manter o valor no input
      // pois so consultamos o valor da chave google quando ele loga no app , nao quando ele fizer alterações
      toast({
        description: "Chave cadastrada com Sucesso!",
      });
    } else if (keySecret) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigGoogleCalendar",
        googleClientSecret: keySecret,
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
            ) : !isChecking ? (
              <span className="relative inline-flex rounded-full h-4 w-4 bg-gray-500"></span>
            ) : (
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            )} 
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <div>
          {!isLoading && (
            <Button onClick={handleGoogleApiStatus}>
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
