import React, { useState, ChangeEvent } from "react";
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

import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSensors } from "@/components/sensor/SensorContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function Reports({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const wss = useWebSocketData();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -10),
    to: new Date(),
  });

  const { dataReport } = useData();
  const { clearDataReport } = useData();
  const { toast } = useToast();
  const [reportSrc, setSrc] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState("");
  const [actionExecDevice, setActionExecDevice] = useState("");
  const { sensors } = useSensors();
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");

  const handleStartHour = (event: ChangeEvent<HTMLInputElement>) => {
    setStartHour(event.target.value);
  };
  const handleEndHour = (event: ChangeEvent<HTMLInputElement>) => {
    setEndHour(event.target.value);
  };

  console.log("datas selecionadas", date?.from, startHour);
  const handleExecDevice = (value: string) => {
    clearDataReport();
    setActionExecDevice(value);
    wss?.sendMessage({
      api: "admin",
      mt: "SelectFromReports",
      src: "RptSensors",
      deveui: value,
      from: date?.from,
      to: date?.to,
    });
  };
  const handleMenu = (value: string) => {
    if (date && value !== "RptSensors") {
      console.log(`ENVIO AO BACKEND RELATÓRIO`);
      wss?.sendMessage({
        api: "admin",
        mt: "SelectFromReports",
        src: value,
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
                <div className="flex align-middle items-center w-full p-2 justify-between">
                  <Label>Hora inicial</Label>
                  <Input className="w-[150px]" type="time" onChange={handleStartHour} />
                  <Label>Hora Final</Label>
                  <Input className="w-[150px]" type="time" onChange={handleEndHour} />
                </div>
              </PopoverContent>
            </Popover>
            <TabsList>
              <TabsTrigger value="RptAvailability">Disponibilidade</TabsTrigger>
              <TabsTrigger value="RptCalls">Chamadas</TabsTrigger>
              <TabsTrigger value="RptActivities">Atividade</TabsTrigger>
              <TabsTrigger value="RptSensors">Sensores</TabsTrigger>

              <TabsTrigger value="RptMensages">Mensagens</TabsTrigger>
            </TabsList>
            <TabsContent value="RptSensors" className="gap-4 py-4 ">
              <div className="flex items-center gap-4 ">
                <div className="flex justify-end gap-1">
                  <Label htmlFor="name">Sensor</Label>
                </div>
                <Select onValueChange={handleExecDevice}>
                  <SelectTrigger className="col-span-1">
                    <SelectValue placeholder="Selecione um Sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sensores</SelectLabel>
                      {sensors.map((sensor) => (
                        <SelectItem
                          key={sensor.sensor_name}
                          value={sensor?.deveui as string}
                        >
                          {sensor.sensor_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>
          <TabsContent value="RptSensors" className="gap-4 py-4 ">
            <Grafico chartData={dataReport.chart} />
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
          <TabsContent value="RptCalls" className="gap-4 py-4">
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
