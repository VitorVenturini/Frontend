import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import texts from "@/_data/texts.json";
import { Switch } from "@/components/ui/switch"

import { useLanguage } from "@/components/language/LanguageContext";
import React, { useState } from "react";

import { addDays, format, set } from "date-fns";
import { Calendar as CalendarIcon, Car } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { Loader2, CircleAlert } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { host } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useAppConfig } from "./ConfigContext";

export default function SMTPconfig() {
  const { smtpConfig } = useAppConfig();
  const [isLoading, setIsLoading] = useState(false);
  const wss = useWebSocketData();
  const [smtpUsername, setSmtpUsername] = useState<string>(
    smtpConfig?.smtpUsername.value || ""
  );
  const [smtpPassword, setSmtpPassword] = useState<string>(
    smtpConfig?.smtpPassword.value || ""
  );
  const [smtpHost, setSmtpHost] = useState<string>(
    smtpConfig?.smtpHost.value || ""
  );
  const [smtpPort, setSmtpPort] = useState<string>(
    smtpConfig?.smtpPort.value || ""
  );
  const [smtpSecure, setSmtpSecure] = useState<boolean>(
    
    smtpConfig?.smtpSecure.value || false
    
  );

  console.log(smtpSecure + " SMTPSECURE")

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmtpUsername(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmtpPassword(e.target.value);
  };
  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmtpHost(e.target.value);
  };
  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    setSmtpPort(e.target.value);
  };
  const handleSecureChange = (e:boolean) => {
    setSmtpSecure(e);
  };
  const handleSmtpConfigUpdate = () => {
    setIsLoading(true);
    wss?.sendMessage({
      api: "admin",
      mt: "UpdateConfigSmtp",
      smtpUsername: smtpUsername,
      smtpPassword: smtpPassword,
      smtpHost: smtpHost,
      smtpPort: smtpPort,
      smtpSecure: smtpSecure,
    });
    setIsLoading(false);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviço de Email</CardTitle>
        <CardDescription>Configuração de envio de email</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 py-9">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            Username
          </Label>
          <Input
            className="col-span-3"
            placeholder="Username"
            value={smtpUsername}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            Senha
          </Label>
          <Input
            className="col-span-3"
            placeholder="Password"
            value={smtpPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            Host
          </Label>
          <Input
            className="col-span-3"
            placeholder="Host"
            value={smtpHost}
            onChange={handleHostChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            Port
          </Label>
          <Input
            className="col-span-3"
            placeholder="Port"
            value={smtpPort}
            onChange={handlePortChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="path">
            SSL
          </Label>
          <Switch 
           onCheckedChange={handleSecureChange}
           checked ={smtpSecure === true}/>


        </div>
      </CardContent>
      <CardFooter className="justify-end">
      <Button
            onClick={handleSmtpConfigUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando
              </>
            ) : (
              "Atualizar"
            )}
          </Button>
      </CardFooter>
    </Card>
  );
}
