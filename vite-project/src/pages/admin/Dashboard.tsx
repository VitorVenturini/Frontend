import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { useData } from "@/Reports/DataContext";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useState } from "react";
import { addDays } from "date-fns";
import React from "react";
import { useUsers } from "@/components/users/usersCore/UserContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useToast } from "@/components/ui/use-toast";



type DateRange = {
    from: Date;
    to: Date;
  };


export function Dashboard() {
    const [date, setDate] = React.useState<DateRange>({
        from: addDays(new Date(), -1),
        to: new Date(),
      });
      const [startHour, setStartHour] = useState("");
      const [endHour, setEndHour] = useState("");
      const wss = useWebSocketData();
      const { clearDataReport } = useData();
      const { toast } = useToast();
      const formatDateTime = (
        date: Date,
        time: string | undefined,
        defaultTime: string
      ): string => {
        const localDate = new Date(date); // Converte a data para o fuso horário local
        const finalTime = time || defaultTime; // Usa o valor padrão se 'time' estiver em branco
    
        // Concatena a data com o tempo fornecido ou padrão
        const formattedLocalDateTime = `${format(
          localDate,
          "yyyy-MM-dd"
        )} ${finalTime}`;
    
        // Converte o datetime concatenado para UTC
        const utcDateTime = new Date(formattedLocalDateTime);
    
        if (isNaN(utcDateTime.getTime())) {
          // Verifica se a data é inválida
          return "Invalid Date";
        }
    
        // Converte o timestamp UTC para o formato 'YYYY-MM-DD HH:mm:ss'
        const utcDate = new Date(utcDateTime.getTime()).toLocaleString("sv-SE", {
          timeZone: "UTC",
          hour12: false,
        });
    
        return utcDate.replace("T", " "); // Retorna no formato 'YYYY-MM-DD HH:mm:ss'
      };


      const handleMenu = (value: string) => {
        clearDataReport();
        if (date) {
          const fromDateTimeUTC = formatDateTime(date.from, startHour, "00:00:00");
          const toDateTimeUTC = formatDateTime(
            date.to ? date.to : date.from,
            endHour,
            "23:59:59"
          );
          console.log(`ENVIO AO BACKEND RELATÓRIO`);
          wss?.sendMessage({
            api: "admin",
            mt: "SelectFromReports",
            src: value,
            from: fromDateTimeUTC,
            to: toDateTimeUTC,
          });
        } else if (value !== "RptSensors" && value !== "RptIotDevices") {
          toast({
            description: "Relatório não gerado, revise seus parâmetros",
          });
        } else if (value === "RptIotDevices") {
          toast({
            description: "Selecione um device para mostrar as fotos",
          });
        } else {
          toast({
            description: "Selecione um sensor para gerar o gráfico",
          });
        }
      };
    
    
    return (
        <div>
        <h1>Dashboard</h1>
        <Button>Click me</Button>
        <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[250px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate as any}
                      numberOfMonths={2}
                    />
                    <div className="flex align-middle items-center w-full p-2 justify-between">
                      <Label>Hora inicial</Label>
                      <Input
                        className="w-[150px]"
                        type="time"
                        onChange={(e) => setStartHour(e.target.value)}
                        value={startHour}
                      />
                      <Label>Hora Final</Label>
                      <Input
                        className="w-[150px]"
                        type="time"
                        value={endHour}
                        onChange={(e) => setEndHour(e.target.value)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Button onClick={() => handleMenu("RptSensors")}>Relatório de Sensores</Button>
        </div>
    );
    }
