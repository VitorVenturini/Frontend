import * as React from "react";
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

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"


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

  const report = async () => {
    console.log(`ENVIO AO BACKEND RELATÓRIO`);
    wss?.sendMessage({
      api: "admin",
      mt: "SelectFromReports",
      src: "RptAvailability",
      //deveui: "24e124725d487636",
      guid: "8166533266978258155",
      from: "2024-07-17T00:00:00:000",
      to: "2024-07-22T23:59:59:000",
    });
  };

  return (
    <Card className="w-full h-full p-2">
      <div className="flex gap-3">
        <div className={cn("grid gap-2", className)}>
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
        </div>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="aviability">Disponibilidade</TabsTrigger>
            <TabsTrigger value="call">Chamadas</TabsTrigger>
            <TabsTrigger value="actions">Atividade</TabsTrigger>
            <TabsTrigger value="sensors">Sensores</TabsTrigger>
            <TabsTrigger value="mensages">Mensagens</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </Card>
  );
}
