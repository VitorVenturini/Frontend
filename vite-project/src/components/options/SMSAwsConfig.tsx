import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  import texts from "@/_data/texts.json";
  import { Switch } from "@/components/ui/switch";
  
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

  export default function swsSmsConfig() {
    const { language } = useLanguage();
    const { awsSNSApiConfig } = useAppConfig();
    const [isLoading, setIsLoading] = useState(false);
    const wss = useWebSocketData();
    const [awsSnsKey, setAwsSnsKey] = useState<string>(
        awsSNSApiConfig?.awsSnsKey.value || ""
    );
    const [awsSnsSecret, setAwsSnsSecret] = useState<string>(
        awsSNSApiConfig?.awsSnsSecret.value || ""
    );
    const [awsSnsRegion, setAwsSnsRegion] = useState<string>(
        awsSNSApiConfig?.awsSnsRegion.value || ""
    );
  
  
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAwsSnsKey(e.target.value);
    };
    const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAwsSnsSecret(e.target.value);
    };
    const handleRegionChange = (value: string) => {
        setAwsSnsRegion(value);
    };
    const handleAwsSmsConfigUpdate = () => {
      setIsLoading(true);
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfigSms",
        awsSnsKey: awsSnsKey,
        awsSnsSecret: awsSnsSecret,
        awsSnsRegion: awsSnsRegion,
      });
      setIsLoading(false);
    };
    return (
      <Card>
        <CardHeader>
          <CardTitle>{texts[language].awsSmsTitle}</CardTitle>
          <CardDescription>{texts[language].awsSmsLabel}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 py-9">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="path">
            {texts[language].awsSmsAccessKey}
            </Label>
            <Input
              className="col-span-3"
              placeholder="Id"
              value={awsSnsKey}
              onChange={handleIdChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="path">
            {texts[language].awsSmsAccessKeySecret}
            </Label>
            <Input
              className="col-span-3"
              placeholder="Secret"
              value={awsSnsSecret}
              onChange={handleSecretChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="path">
                {texts[language].awsSmsRegion}
            </Label>
            <Select value={awsSnsRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma região" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].awsSmsRegion}</SelectLabel>
                  <SelectItem key='us-east-1' value='us-east-1'>
                        US East (N. Virginia)
                    </SelectItem>
                    <SelectItem key='us-east-2' value='us-east-2'>
                        US East (Ohio)
                    </SelectItem>
                    <SelectItem key='us-west-1' value='us-west-1'>
                        US West (N. California)
                    </SelectItem>
                    <SelectItem key='us-west-2' value='us-west-2'>
                        US West (Oregon)
                    </SelectItem>
                    <SelectItem key='ca-central-1' value='ca-central-1'>
                        Canada (Central)
                    </SelectItem>
                    <SelectItem key='sa-east-1' value='sa-east-1'>
                        South America (São Paulo)
                    </SelectItem>
                    <SelectItem key='eu-central-1' value='eu-central-1'>
                        Europe (Frankfurt)
                    </SelectItem>
                    <SelectItem key='eu-west-1' value='eu-west-1'>
                        Europe (Ireland)
                    </SelectItem>
                    <SelectItem key='eu-west-2' value='eu-west-2'>
                        Europe (London)
                    </SelectItem>
                    <SelectItem key='eu-west-3' value='eu-west-3'>
                        Europe (Paris)
                    </SelectItem>
                    <SelectItem key='eu-south-1' value='eu-south-1'>
                        Europe (Milan)
                    </SelectItem>
                    <SelectItem key='eu-north-1' value='eu-north-1'>
                        Europe (Stockholm)
                    </SelectItem>
                    <SelectItem key='ap-east-1' value='ap-east-1'>
                        Asia Pacific (Hong Kong)
                    </SelectItem>
                    <SelectItem key='ap-south-1' value='ap-south-1'>
                        Asia Pacific (Mumbai)
                    </SelectItem>
                    <SelectItem key='ap-south-2' value='ap-south-2'>
                        Asia Pacific (Hyderabad)
                    </SelectItem>
                    <SelectItem key='ap-southeast-1' value='ap-southeast-1'>
                        Asia Pacific (Singapore)
                    </SelectItem>
                    <SelectItem key='ap-southeast-2' value='ap-southeast-2'>
                        Asia Pacific (Sydney)
                    </SelectItem>
                    <SelectItem key='ap-southeast-3' value='ap-southeast-3'>
                        Asia Pacific (Jakarta)
                    </SelectItem>
                    <SelectItem key='ap-southeast-4' value='ap-southeast-4'>
                        Asia Pacific (Melbourne)
                    </SelectItem>
                    <SelectItem key='ap-northeast-1' value='ap-northeast-1'>
                        Asia Pacific (Tokyo)
                    </SelectItem>
                    <SelectItem key='ap-northeast-2' value='ap-northeast-2'>
                        Asia Pacific (Seoul)
                    </SelectItem>
                    <SelectItem key='ap-northeast-3' value='ap-northeast-3'>
                        Asia Pacific (Osaka)
                    </SelectItem>
                    <SelectItem key='af-south-1' value='af-south-1'>
                        Africa (Cape Town)
                    </SelectItem>
                    <SelectItem key='me-south-1' value='me-south-1'>
                        Middle East (Bahrain)
                    </SelectItem>
                    <SelectItem key='me-central-1' value='me-central-1'>
                        Middle East (UAE)
                    </SelectItem>
                    <SelectItem key='cn-north-1' value='cn-north-1'>
                        China (Beijing)
                    </SelectItem>
                    <SelectItem key='cn-northwest-1' value='cn-northwest-1'>
                        China (Ningxia)
                    </SelectItem>
                    <SelectItem key='il-central-1' value='il-central-1'>
                        Israel (Tel Aviv)
                    </SelectItem>
                    <SelectItem key='us-gov-west-1' value='us-gov-west-1'>
                        AWS GovCloud (US-West)
                    </SelectItem>
                    <SelectItem key='us-gov-east-1' value='us-gov-east-1'>
                        AWS GovCloud (US-East)
                    </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleAwsSmsConfigUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {texts[language].updating}
              </>
            ) : (
                texts[language].update
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  