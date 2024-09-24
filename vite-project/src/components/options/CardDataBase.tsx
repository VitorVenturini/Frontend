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

import { Label } from "@/components/ui/label";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export default function CardDataBase() {
  const [date, setDate] = React.useState<Date>();
  const { language } = useLanguage();

  const backUp = async () => {
    try {
      const response = await fetch(host + "/api/backupDataBase", {
        method: "GET",

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

  };
  return (
    <Card className="w-[630px] h-fit">
      <CardHeader>
        <CardTitle>Backup do Banco de Dados</CardTitle>
        <CardDescription>Download do backup do banco de dados</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 py-9">
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
                  format(date, "PPP")
                ) : (
                  <span>{texts[language].chooseDate}</span>
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
        <div className="grid grid-cols-2 items-center gap-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Recorrencia
          </h4>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={texts[language].options} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{texts[language].options}</SelectLabel>
                <SelectItem value="RptCalls">
                  Semanal
                </SelectItem>
                <SelectItem value="RptActivities">
                  Díario
                </SelectItem>
                <SelectItem value="RptAvailability">
                  Mensal
                </SelectItem>
                <SelectItem value="RptMessages">
                  Bimestral
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={backUp}> Download </Button>
      </CardFooter>
    </Card>
  );
}
