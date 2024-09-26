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

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";

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


export default function CardDataBase() {
  const [date, setDate] = React.useState<Date>();
  console.log(date)

  const { language } = useLanguage();
  const account = useAccount();

  const backUp = async () => {
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
        a.download = response.headers.get("Content-Disposition") || "backup.dump"; // Define o nome do arquivo de download
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
  };
  const backUpFiles = async () => {
    console.log(date)
    try {
      const response = await fetch(host + "/api/backupFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": account.accessToken || "",
          
        },
        body: JSON.stringify({
          from: date ? format(date, "yyyy/MM/dd") : format(new Date(), "yyyy/MM/dd"),
        }),
        
      });
      if (response.ok) {
        console.log(response);
        const blob = await response.blob(); // Obtém o PDF como um blob
        const url = window.URL.createObjectURL(blob); // Cria um URL temporário para o blob

        // Cria um link temporário para o download do PDF
        const a = document.createElement("a");
        a.href = url;
        a.download = response.headers.get("Content-Disposition") || "backup.zip"; // Define o nome do arquivo de download
        
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
            <Label className="text-end" htmlFor="buttonName">
              Destino
            </Label>
            <Input
              className="col-span-2"
              id="buttonName"
              placeholder="Escreva seu destino"
              value={null}
              onChange={null}
              required
            />
            {/* {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].alarmButtonRequired}
            </div>
          )} */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Usuário
            </Label>
            <Input
              className="col-span-2"
              id="buttonName"
              placeholder="Escreva seu usuário"
              value={null}
              onChange={null}
              required
            />
            {/* {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].alarmButtonRequired}
            </div>
          )} */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Senha
            </Label>
            <Input
              className="col-span-2"
              id="buttonName"
              placeholder="Digite sua senha"
              value={null}
              onChange={null}
              required
            />
            {/* {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].alarmButtonRequired}
            </div>
          )} */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-end" htmlFor="buttonName">
              Protocolo
            </Label>
            <Select>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="selecione um Protocolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="RptCalls">Semanal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* {nameButton.trim() === "" && (
            <div className="text-sm text-red-400 flex gap-1 align-middle items-center p-2 col-start-4">
              <CircleAlert size={15} />
              {texts[language].alarmButtonRequired}
            </div>
          )} */}
          </div>
          
          <Separator className="mt-6"/>
          <CardHeader>
            <CardTitle>Recorrência</CardTitle>
            <CardDescription>
              Configurações de recorrencia de backup de arquivos
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
              Frequencia
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="selecione uma frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                
                  <SelectItem value="RptCalls">Semanal</SelectItem>
                  <SelectItem value="RptActivities">Díario</SelectItem>
                  <SelectItem value="RptAvailability">Mensal</SelectItem>
                  <SelectItem value="RptMessages">Bimestral</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-end" htmlFor="buttonName">
              Dia
            </Label>
            <Select>
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="RptCalls">Semanal</SelectItem>
                  <SelectItem value="RptActivities">Díario</SelectItem>
                  <SelectItem value="RptAvailability">Mensal</SelectItem>
                  <SelectItem value="RptMessages">Bimestral</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label className="text-end" htmlFor="buttonName">
             Hora
            </Label>
            <Select>
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="hora" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                
                  <SelectItem value="RptCalls">Semanal</SelectItem>
                  <SelectItem value="RptActivities">Díario</SelectItem>
                  <SelectItem value="RptAvailability">Mensal</SelectItem>
                  <SelectItem value="RptMessages">Bimestral</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={null}> Salvar </Button>
        </CardFooter>
      </Card>
      <div className="flec col gap-2 space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Banco de dados</CardTitle>
          <CardDescription>Backup de todo o banco de dados</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button onClick={backUp}> Download </Button>
        </CardFooter>
      </Card>
      <Card >
        <CardHeader>
          <CardTitle>Backup de arquivos</CardTitle>
          <CardDescription>Selecione uma data para fazer o backup de arquivos</CardDescription>
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
                         (
                          format(date, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
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
          <Button onClick={backUpFiles}> Download </Button>
        </CardFooter>
      </Card>
      </div>

    </div>
  );
}
