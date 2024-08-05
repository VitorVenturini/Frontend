import React, { createContext, useState, useContext, ReactNode } from "react";
import { Button } from "../ui/button";
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
import { Grafico } from "../charts/lineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColumnsReports from "@/Reports/collumnsReports";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Reports({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const handleClick = () => {
    console.log("click report");
    report();
  };
  const wss = useWebSocketData();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  });
  const getData = ({ children }: { children: ReactNode }) => {
    const [jsonData, setJsonData] = useState<any[]>([]);
  
    const newFragments = (jsonData: any[]) => {
      setJsonData((receivedFragments) => [...receivedFragments, jsonData]);
    };
  };
  const [receivedFragments, setReceivedFragments] = useState<any[]>([]);
  const [clockTime, setClockTime] = useState("");
  const [jsonKeys, setJsonKeys] = useState<string[]>([]);
  const [reportType, setReportType] = useState<string>("");
  const [reportSrc, setSrc] = useState<string>("");


  console.log("datas selecionadas", date);
  const report = async () => {
    console.log(`ENVIO AO BACKEND RELATÓRIO`);
    wss?.sendMessage({
      api: "admin",
      mt: "SelectFromReports",
      src: "RptSensors",
      deveui: "24e124725d487636",
        guid: "4537493012864503132",
      from: date?.from,
      to: date?.to,
    });
  };
  const handleClock = () => {
    console.log("clocktime", clockTime);
    setClockTime(clockTime);
  };
  return (
    <Card className="w-full h-full p-2">
      <div className="flex gap-3">
        <Tabs defaultValue="account" className="w-full flex-col">
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
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <TabsList>
              <TabsTrigger value="aviability" onClick={handleClick}>
                Disponibilidade
              </TabsTrigger>
              <TabsTrigger value="call">Chamadas</TabsTrigger>
              <TabsTrigger value="actions">Atividade</TabsTrigger>
              <TabsTrigger value="sensors" onClick={handleClick}>
                Sensores
              </TabsTrigger>

              <TabsTrigger value="mensages">Mensagens</TabsTrigger>
            </TabsList>

            <div className={cn("grid gap-2", className)}></div>
          </div>
          <TabsContent value="sensors" className="gap-4 py-4 ">
            <Grafico />
          </TabsContent>
          <TabsContent value="aviability" className="gap-4 py-4 ">
            <ColumnsReports
              data={[]}
              keys={jsonKeys}
              report={reportSrc}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
