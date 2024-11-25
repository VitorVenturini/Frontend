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
  
  export default function APIFlicCard() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { language } = useLanguage();
    const { toast } = useToast();
    const wss = useWebSocketData();
    const {flicSecretApi} = useAppConfig()
  
  
    const [key, setKey] = useState(flicSecretApi?.value || "");

    const handleApiKey = (event: ChangeEvent<HTMLInputElement>) => {
        setKey(event.target.value);
    };
  
    const handleSendFlicApiKey = () => {
      setIsLoading(true);
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "flicSecretApi",
        vl: key,
      });
      setIsLoading(false);
    };
    return (
        <Card className="w-[50%] h-fit">
              <CardHeader>
                <CardTitle>{texts[language].flicCardTitle}</CardTitle>
                <CardDescription>{texts[language].flicCardLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {texts[language].key}
                    </h4>
                    <Input
                      className="w-full"
                      onChange={handleApiKey}
                      value={key}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {!isLoading && <Button onClick={handleSendFlicApiKey}>{texts[language].save}</Button>}
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
  