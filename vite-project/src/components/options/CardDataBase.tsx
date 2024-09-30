import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import React, { useState } from "react";

import { addDays, format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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

export default function CardDataBase() {
  const [date, setDate] = React.useState<Date>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const { backupConfig } = useAppConfig();
  const wss = useWebSocketData();
  console.log("filto de backup" + JSON.stringify(backupConfig));
  const { language } = useLanguage();
  const [backupUsername, setBackupUsername] = useState<string>(
    backupConfig?.backupUsername?.value || ""
  );
  const [backupPassword, setBackupPassword] = useState<string>(
    backupConfig?.backupPassword?.value || ""
  );
  const [backupFrequency, setBackupFrequency] = useState<string>(
    backupConfig?.backupFrequency?.value || ""
  );
  const [backupDay, setBackupDay] = useState<string>(
    backupConfig?.backupDay?.value || ""
  );
  const [backupHour, setBackupHour] = useState<string>(
    backupConfig?.backupHour.value || ""
  );
  const [backupHost, setBackupHost] = useState<string>(
    backupConfig?.backupHost?.value || ""
  );
  const [backupPath, setBackupPath] = useState(
    backupConfig?.backupPath.value || ""
  );
  const [backupMethod, setBackupMethod] = useState<string>(
    backupConfig?.backupMethod.value || ""
  );
  const account = useAccount();

  const handleUpdateConfigBackupSchedule = () => {
    setIsLoading1(true);
    console.log("Mensagem para a API:");
    wss?.sendMessage({
      api: "admin",
      mt: "UpdateConfigBackupSchedule",
      backupUsername: backupUsername,
      backupPassword: backupPassword,
      backupFrequency: backupFrequency,
      backupDay: backupDay,
      backupHour: backupHour,
      backupHost: backupHost,
      backupPath: backupPath,
      backupMethod: backupMethod,
    });
    setIsLoading1(false);
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupUsername(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupPassword(event.target.value);
  };
  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackupFrequency(event.target.value as string);
  };
  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupDay(event.target.value);
  };
  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupHour(event.target.value);
  };
  const handleHostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupHost(event.target.value);
  };
  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupPath(event.target.value);
  };
  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackupMethod(event.target.value as string);
  };

  const backUp = async () => {
    setIsLoading2(true);
    try {
      const response = await fetch(host + "/api/backupDataBase", {
        headers: {
          "Content-Type": "application/json",
          "x-auth": account.accessToken || "",
        },
        method: "GET",
      });
      if (response.ok) {
        console.log(response);
        const blob = await response.blob(); // Obtém o PDF como um blob
        const url = window.URL.createObjectURL(blob); // Cria um URL temporário para o blob

        // Cria um link temporário para o download do PDF
        const a = document.createElement("a");
        a.href = url;
        a.download =
          response.headers.get("Content-Disposition") || "backup.dump"; // Define o nome do arquivo de download
        document.body.appendChild(a);
        a.click(); // Simula um clique no link para iniciar o download

        // Remove o link após o download
        a.remove();
        window.URL.revokeObjectURL(url); // Limpa o URL temporário

        console.log("PDF enviado e download iniciado com sucesso!");
      } else {
        console.error("Erro ao executar o backup.");
      }
    } catch (error) {
      console.error("Erro ao executar o backup:", error);
    }
    setIsLoading2(false);
  };
  const backUpFiles = async () => {
    setIsLoading3(true);
    console.log(date);
    try {
      const response = await fetch(host + "/api/backupFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": account.accessToken || "",
        },
        body: JSON.stringify({
          from: date
            ? format(date, "yyyy/MM/dd")
            : format(new Date(), "yyyy/MM/dd"),
        }),
      });
      if (response.ok) {
        console.log(response);
        const blob = await response.blob(); // Obtém o PDF como um blob
        const url = window.URL.createObjectURL(blob); // Cria um URL temporário para o blob

        // Cria um link temporário para o download do PDF
        const a = document.createElement("a");
        a.href = url;
        a.download = "BACKUP" + ".dump"; // Define o nome do arquivo de download

        document.body.appendChild(a);
        a.click(); // Simula um clique no link para iniciar o download

        // Remove o link após o download
        a.remove();
        window.URL.revokeObjectURL(url); // Limpa o URL temporário

        console.log("PDF enviado e download iniciado com sucesso!");
      } else {
        console.error("Erro ao executar o backup.");
      }
    } catch (error) {
      console.error("Erro ao executar o backup:", error);
    }
    setIsLoading3(false);
  };

  return (
    <div className="flex gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Agendamento de Backup</CardTitle>
          <CardDescription>
            configurações para o Agendamento de backup do serviço{" "}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 py-9">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="path">
              Pasta de Destino
            </Label>
            <Input
              className="col-span-3"
              id="patch"
              placeholder="Pasta de Destino"
              value={backupPath}
              onChange={handlePathChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="host">
              Host
            </Label>
            <Input
              className="col-span-3"
              id="patch"
              placeholder="Escreva seu destino"
              value={backupHost}
              onChange={handleHostChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="backupUsername">
              Usuário
            </Label>
            <Input
              type="text"
              className="col-span-3"
              id="backupUsername"
              placeholder="Escreva seu usuário"
              value={backupUsername}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="backupPassword">
              Senha
            </Label>
            <Input
              className="col-span-3"
              id="backupPassword"
              placeholder="Digite sua senha"
              value={backupPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="backupHost">
              Protocolo
            </Label>
            <Select onValueChange={setBackupMethod} value={backupMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="selecione um Protocolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ftp">FTP</SelectItem>
                  <SelectItem value="scp">SCP</SelectItem>
                  <SelectItem value="webdav">Webdav</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator className="mt-6" />
          <CardHeader>
            <CardTitle>Recorrência</CardTitle>
            <CardDescription>
              Configurações de recorrencia de backup de arquivos
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="backupFrequency">
              Frequencia
            </Label>
            <Select onValueChange={setBackupFrequency} value={backupFrequency}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="selecione uma frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">Mensal</SelectItem>
                  <SelectItem value="3">Trimestral</SelectItem>
                  <SelectItem value="6">Semestral</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Dia
            </Label>
            <Select onValueChange={setBackupDay} value={backupDay}>
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="Dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="01">01</SelectItem>
                  <SelectItem value="02">02</SelectItem>
                  <SelectItem value="03">03</SelectItem>
                  <SelectItem value="04">04</SelectItem>
                  <SelectItem value="05">05</SelectItem>
                  <SelectItem value="06">06</SelectItem>
                  <SelectItem value="07">07</SelectItem>
                  <SelectItem value="08">08</SelectItem>
                  <SelectItem value="09">09</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="13">13</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="17">17</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="19">19</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="21">21</SelectItem>
                  <SelectItem value="22">22</SelectItem>
                  <SelectItem value="23">23</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="26">26</SelectItem>
                  <SelectItem value="27">27</SelectItem>
                  <SelectItem value="28">28</SelectItem>
                  <SelectItem value="29">29</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label className="text-end" htmlFor="backupHour">
              Hora
            </Label>
            <Select onValueChange={setBackupHour} value={backupHour}>
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="00:00">00:00</SelectItem>
                  <SelectItem value="01:00">01:00</SelectItem>
                  <SelectItem value="02:00">02:00</SelectItem>
                  <SelectItem value="03:00">03:00</SelectItem>
                  <SelectItem value="04:00">04:00</SelectItem>
                  <SelectItem value="05:00">05:00</SelectItem>
                  <SelectItem value="06:00">06:00</SelectItem>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                  <SelectItem value="23:00">23:00</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleUpdateConfigBackupSchedule}
            disabled={isLoading1}
          >
            {isLoading1 ? (
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
      <div className="flec col gap-2 space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Banco de dados</CardTitle>
            <CardDescription>Backup de todo o banco de dados</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button onClick={backUp} disabled={isLoading2}>
              {isLoading2 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Download
                </>
              ) : (
                "Download"
              )}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Backup de arquivos</CardTitle>
            <CardDescription>
              Selecione uma data para fazer o backup de arquivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 items-center gap-4">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Com início em
              </h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "LLL dd, y")
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={backUpFiles} disabled={isLoading3}>
              {isLoading3 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Download
                </>
              ) : (
                "Download "
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
