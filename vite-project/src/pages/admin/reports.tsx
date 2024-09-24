import React, { useState, useEffect, ChangeEvent } from "react";
import ReactAudioPlayer from "react-audio-player";
import { Button } from "@/components/ui/button";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Divide } from "lucide-react";
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
import { useUsers } from "@/components/users/usersCore/UserContext";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type DateRange = {
  from: Date;
  to: Date;
};
import { useSensors } from "@/components/sensor/SensorContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCameras } from "@/components/cameras/CameraContext";
import { useAppConfig } from "@/components/options/ConfigContext";
import { LoaderBar } from "@/components/LoaderBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Margin, usePDF } from "react-to-pdf";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { PdfGerate } from "@/Reports/ExportReports";

export default function Reports({}: React.HTMLAttributes<HTMLDivElement>) {
  const { users } = useUsers();
  const wss = useWebSocketData();
  const [date, setDate] = React.useState<DateRange>({
    from: addDays(new Date(), -1),
    to: new Date(),
  });

  const { dataReport, clearDataReport } = useData();
  const { toast } = useToast();
  const reportSrc = dataReport.src as any;
  const [selectedUser, setSelectedUser] = useState("");
  const [actionExecDevice, setActionExecDevice] = useState("");
  const { sensors } = useSensors();
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const { cameras } = useCameras();
  const { loadBarData, clearLoadBarData } = useAppConfig();
  const [selectRpt, setSelectRpt] = useState("");
  const { targetRef, toPDF } = usePDF({
    method: "open",
    filename: "usepdf-example.pdf",
    page: { margin: Margin.NONE, orientation: "landscape" },
  });
  const { language } = useLanguage();
  const handleClear = () => {
    clearDataReport();
    clearLoadBarData();
  };

  const handleStartHour = (event: ChangeEvent<HTMLInputElement>) => {
    setStartHour(event.target.value);
  };

  const handleEndHour = (event: ChangeEvent<HTMLInputElement>) => {
    setEndHour(event.target.value);
  };

  const formatDateTime = (
    date: Date,
    time: string,
    defaultTime: string
  ): string => {
    const formattedDate = format(date, "yyyy-MM-dd"); // Formata a data no padrão 'YYYY-MM-DD'
    const finalTime = time || defaultTime; // Usa o valor padrão se 'time' estiver em branco
    return `${formattedDate} ${finalTime}:00`; // Retorna a data e hora no formato 'YYYY-MM-DD HH:mm:ss'
  };

  const replaceData = (users: any[], item: any, columnName: string): any => {
    const user = users.find(
      (user: any) =>
        user.guid === item[columnName] || user.sip === item[columnName]
    );
    if (user) {
      item[columnName] = user.name;
    }
    return item;
  };

  let ajustData = [];
  if (reportSrc !== "RptAvailability" && reportSrc !== "RptSensors") {
    ajustData = dataReport.table.map((item: any) => {
      if (item) {
        switch (reportSrc) {
          case "RptActivities":
            item = replaceData(users, item, "guid");
            item = replaceData(users, item, "from");
            return item;

          case "RptCalls":
            item = replaceData(users, item, "guid");
            item = replaceData(users, item, "number");
            return item;
          case "RptMessages":
            item = replaceData(users, item, "from_guid");
            item = replaceData(users, item, "to_guid");
            return item;

          default:
            item = replaceData(users, item, "guid");
            if (item.guid) {
              return {
                ...item,
                name: item.guid,
              };
            }
            break;
        }
      }

      return item; // Retorne o item original se for undefined ou null
    });

    console.log("Dados ajustados:", ajustData);
  }

  const handleExecDevice = () => {
    clearDataReport();
    console.log(selectRpt);
    if (selectRpt && date?.from) {
      // Verificação se 'date' e 'date.from' estão definidos
      const fromDateTimeUTC = formatDateTime(date.from, startHour, "00:00:00");
      const toDateTimeUTC = formatDateTime(
        date.to ? date.to : date.from,
        endHour,
        "23:59:59"
      );
      wss?.sendMessage({
        api: "admin",
        mt: "SelectFromReports",
        src: "RptSensors",
        deveui: selectRpt,
        from: fromDateTimeUTC,
        to: toDateTimeUTC,
      });
    } else {
      console.error("Data não definida corretamente.");
    }
  };
  const handleIotDevice = () => {
    clearDataReport();
    console.log(selectRpt);
    if (selectRpt && date?.from) {
      // Verificação se 'date' e 'date.from' estão definidos
      const fromDateTimeUTC = formatDateTime(date.from, startHour, "00:00:00");
      const toDateTimeUTC = formatDateTime(
        date.to ? date.to : date.from,
        endHour,
        "23:59:59"
      );
      wss?.sendMessage({
        api: "admin",
        mt: "SelectFromReports",
        src: "RptIotHistory",
        deveui: selectRpt,
        from: fromDateTimeUTC,
        to: toDateTimeUTC,
      });
    } else {
      console.error("Data não definida corretamente.");
    }
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
        guid: selectedUser,
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
    <div className="flex justify-center">
      <Card className="w-full h-full p-2 m-2 max-w-[1800px]">
        <div className="flex gap-3">
          <Tabs defaultValue="account" className="w-full h-full flex-col">
            <div className="flex gap-4 justify-between">
              <div className="flex justify-start gap-4">
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
                <TabsList>
                  <TabsTrigger value="RptAvailability">
                    Disponibilidade
                  </TabsTrigger>
                  <TabsTrigger value="RptCalls" onClick={handleClear}>
                    Chamadas
                  </TabsTrigger>
                  <TabsTrigger value="RptActivities" onClick={handleClear}>
                    Atividade
                  </TabsTrigger>
                  <TabsTrigger value="RptMessages" onClick={handleClear}>
                    Mensagens
                  </TabsTrigger>
                  <TabsTrigger value="RptSensors" onClick={handleClear}>
                    Sensores
                  </TabsTrigger>
                  <TabsTrigger value="RptIotDevices" onClick={handleClear}>
                    Iot Câmeras
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="RptSensors" className="gap-4">
                  <div className="grid items-center justify-start grid-cols-4 gap-4 h-[10px] ">
                    <div className="grid justify-start col-span-1 gap-1 ">
                      <Label htmlFor="name">Sensor</Label>
                    </div>
                    <Select onValueChange={setSelectRpt}>
                      <SelectTrigger className="col-span-2">
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
                <TabsContent value="RptIotDevices" className="gap-4 ">
                  <div className="grid items-center justify-start grid-cols-4 gap-4 h-[10px] ">
                    <div className="grid justify-start col-span-1 gap-1 ">
                      <Label htmlFor="name">Iot Câmeras</Label>
                    </div>
                    <Select onValueChange={setSelectRpt}>
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Selecione um Device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Iot Câmeras</SelectLabel>
                          {cameras.map((camera) => (
                            <SelectItem
                              key={camera.nickname}
                              value={camera?.mac as string}
                            >
                              {camera.nickname}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </div>
              <div className="flex items-end justify-end">
                <TabsContent value="RptSensors" className="flex gap-2">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button onClick={() => handleExecDevice()}>Consultar</Button>
                </TabsContent>
                <TabsContent value="RptIotDevices" className="flex">
                  <Button
                    className="flex justify-end"
                    onClick={() => handleIotDevice()}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptAvailability" className="flex">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptAvailability")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptCalls" className="flex">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptCalls")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptActivities" className="flex">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptActivities")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptMessages" className="flex">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptMessages")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
              </div>
            </div>
            <TabsContent value="RptSensors" className="gap-4 py-4">
              {dataReport.chart.length == 0 && loadBarData.unitValue > 0 ? (
                <div className="w-full align-middle items-center justify-center h-[600px] flex">
                  <LoaderBar
                    total={loadBarData.total}
                    unitValue={loadBarData.unitValue}
                  />
                </div>
              ) : (
                <div ref={targetRef}>
                  <Grafico chartData={dataReport.chart} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="RptIotDevices" className="gap-4 py-4">
              {dataReport.img.length == 0 && loadBarData.unitValue > 0 ? (
                <div className="w-full align-middle items-center justify-center h-[600px] flex">
                  <LoaderBar
                    total={loadBarData.total}
                    unitValue={loadBarData.unitValue}
                  />
                </div>
              ) : (
                <ScrollArea className="w-full align-middle items-center justify-center h-full">
                  <div className="flex flex-wrap gap-4">
                    {dataReport.img.map((item, index) => (
                      <Dialog key={item.id}>
                        <DialogTrigger>
                          <div className="flex flex-col items-center">
                            <img
                              src={item.image}
                              alt={`Image ${index}`}
                              className="object-cover w-32 h-32"
                            />
                            <p className="text-xs">{item.date}</p>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="h-full max-w-5xl">
                          <img
                            src={item.image}
                            alt={`Image ${index}`}
                            className="w-full h-full"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="RptAvailability" className="gap-4 py-4">
              {dataReport.table.length == 0 ? (
                <div className="w-full align-middle items-center justify-center h-[600px] flex">
                  <LoaderBar
                    total={loadBarData.total}
                    unitValue={loadBarData.unitValue}
                  />
                </div>
              ) : (
                <div className="w-full" data-print="print">
                  <ColumnsReports
                    data={dataReport.table}
                    keys={dataReport.keys}
                    report={dataReport.src as any}
                    filter={"Filtro"}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="RptActivities" className="gap-4 py-4">
              {dataReport.table.length == 0 ? (
                <div className="w-full align-middle items-center justify-center h-[600px] flex">
                  <LoaderBar
                    total={loadBarData.total}
                    unitValue={loadBarData.unitValue}
                  />
                </div>
              ) : (
                <div className="w-full" data-print="print">
                  <ColumnsReports
                    data={dataReport.table}
                    keys={dataReport.keys}
                    report={dataReport.src as any}
                    filter={"Filtro"}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="RptMessages" className="gap-4 py-4">
              {dataReport.table.length == 0 ? (
                <div className="w-full align-middle items-center justify-center h-[600px] flex">
                  <LoaderBar
                    total={loadBarData.total}
                    unitValue={loadBarData.unitValue}
                  />
                </div>
              ) : (
                <div className="w-full" data-print="print">
                  <ColumnsReports
                    data={dataReport.table}
                    keys={dataReport.keys}
                    report={dataReport.src as any}
                    filter={"Filtro"}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="RptCalls" className="gap-4 py-4">
              {dataReport.table.length == 0 ? (
                <div className="w-full align-middle items-center justify-center h-[600px] flex">
                  <LoaderBar
                    total={loadBarData.total}
                    unitValue={loadBarData.unitValue}
                  />
                </div>
              ) : (
                <div className="w-full" data-print="print">
                  <ColumnsReports
                    data={dataReport.table}
                    keys={dataReport.keys}
                    report={dataReport.src as any}
                    filter={"Filtro"}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
