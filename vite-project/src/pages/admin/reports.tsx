import React, { createContext, useState, useContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Grafico } from "@/components/charts/lineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColumnsReports from "@/Reports/collumnsReports";

import { useUsers } from "@/components/user/UserContext";
import { useData } from "@/Reports/DataContext";

import {
  Card,

} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Reports({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const wss = useWebSocketData();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  });

  const { dataReport } = useData();
  const { toast } = useToast();
  const [reportSrc, setSrc] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState("");
  console.log("datas selecionadas", date);

  const handleMenu = (value: string) => {
    if (date) {
      console.log(`ENVIO AO BACKEND RELATÓRIO`);
      wss?.sendMessage({
        api: "admin",
        mt: "SelectFromReports",
        src: value,
        deveui: '24e124725d487636',
        guid: selectedUser,
        from: date?.from,
        to: date?.to,
      });
    } else {
      toast({
        description: "Relatório não gerado, revise seus parâmetros",
      });
    }
  };
  return (
    <Card className="w-full h-full p-2">
      <div className="flex gap-3">
        <Tabs
          defaultValue="account"
          className="w-full flex-col"
          onValueChange={handleMenu}
        >
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {" "}
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
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <TabsList>
              <TabsTrigger value="RptAvailability">Disponibilidade</TabsTrigger>
              <TabsTrigger value="RptCalls">Chamadas</TabsTrigger>
              <TabsTrigger value="RptActivities">Atividade</TabsTrigger>
              <TabsTrigger value="RptSensors">Sensores</TabsTrigger>

              <TabsTrigger value="RptMensages">Mensagens</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="RptSensors" className="gap-4 py-4 ">
            <Grafico chartData={dataReport.chart}/>
          </TabsContent>
          <TabsContent value="RptAvailability" className="gap-4 py-4">
            
            {dataReport?.table[0] && (
              <ColumnsReports
                data={dataReport.table}
                keys={dataReport.keys}
                report={dataReport.src}
              />
            )}
          </TabsContent>
          <TabsContent value="RptActivities" className="gap-4 py-4">

            {dataReport?.table[0] && (
              <ColumnsReports
                data={dataReport.table}
                keys={dataReport.keys}
                report={dataReport.src}
              />
            )}
          </TabsContent>
          <TabsContent value="RptMensages" className="gap-4 py-4">
            {dataReport?.table[0] && (
              <ColumnsReports
                data={dataReport.table}
                keys={dataReport.keys}
                report={dataReport.src}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
