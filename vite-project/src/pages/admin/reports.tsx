import React, { useState, useEffect, ChangeEvent, useRef } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type DateRange = {
  from: Date;
  to: Date;
};
import { Card, CardContent } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Package } from "lucide-react";
import { PackageOpen } from "lucide-react";
import { Square } from "lucide-react";
import { SquareCheck } from "lucide-react";
import { ArrowRightCircle } from "lucide-react";
import { ArrowLeftCircle } from "lucide-react";
import { X } from "lucide-react";

export default function Reports({}: React.HTMLAttributes<HTMLDivElement>) {
  const { users } = useUsers();
  const wss = useWebSocketData();
  const [date, setDate] = React.useState<DateRange>({
    from: addDays(new Date(), -1),
    to: new Date(),
  });
  const [selectedImages, setSelectedImages] = useState<{
    [key: string]: string;
  }>({});
  const [isDownload, setIsDownload] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
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
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  // Abrir a imagem em full screen
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Navegar para a próxima imagem
  const handleNextImage = () => {
    if (currentImageIndex !== null) {
      const nextIndex = (currentImageIndex + 1) % dataReport.img.length;
      setCurrentImageIndex(nextIndex);
    }
  };
  // Navegar para a imagem anterior
  const handlePrevImage = () => {
    if (currentImageIndex !== null) {
      const prevIndex =
        (currentImageIndex - 1 + dataReport.img.length) % dataReport.img.length;
      setCurrentImageIndex(prevIndex);
    }
  };

  const { language } = useLanguage();
  const handleClear = () => {
    clearDataReport();
    clearLoadBarData();
  };
  const handleDownload = () => {
    setIsDownload(true);
  };
  const handleCheckAll = () => {
    const newSelectedImages = {} as any;

    if (!checkAll) {
      // Marca todas as imagens
      dataReport.img.forEach((item) => {
        newSelectedImages[item.id] = item.date.replace(/\//g, "-"); // Substitui '/' por '-' no nome da imagem
      });
    }

    setSelectedImages(newSelectedImages); // Atualiza o estado de selectedImages
    setCheckAll(!checkAll); // Inverte o estado de checkAll
  };
  const handleStartHour = (event: ChangeEvent<HTMLInputElement>) => {
    setStartHour(event.target.value);
  };

  const handleEndHour = (event: ChangeEvent<HTMLInputElement>) => {
    setEndHour(event.target.value);
  };

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

  const handleCheckboxChange = (id: number, date: string) => {
    const newSelectedImages = { ...selectedImages };
    if (selectedImages[id]) {
      delete newSelectedImages[id]; // Desmarca a imagem
    } else {
      newSelectedImages[id] = date.replace(/\//g, "-"); // Marca a imagem
    }
    setSelectedImages(newSelectedImages);
  };
  const replaceData = (users: any[], item: any, columnName: string): any => {
    const user = users.find(
      (user: any) =>
        user.guid === item[columnName] || user.sip === item[columnName]
    );
    if (user) {
      item[columnName] = user.name;
    } else {
      const filteredSensor = sensors.filter((sensor) => {
        return sensor.deveui === item[columnName];
      })[0];
      if(filteredSensor?.sensor_name){
        item[columnName] = filteredSensor?.sensor_name;
      }else{
        item = item
      }
 
    }
    return item;
  };
  // Função para gerar e baixar o arquivo .zip
  const downloadSelectedImages = async () => {
    const zip = new JSZip();

    // Filtrar as imagens selecionadas
    const selected = dataReport.img.filter((item) => selectedImages[item.id]);

    if (selected.length === 0) {
      setIsDownload(false);
      return;
    }

    // Adicionar cada imagem ao arquivo .zip
    selected.forEach((item) => {
      const imgData = item.image.replace(/^data:image\/(png|jpeg);base64,/, "");
      const fileName = `${item.date.replace(/\//g, "-")}(${item.id}).jpg`; // Adiciona o item.id após a data
      zip.file(fileName, imgData, { base64: true });
    });

    // Gerar o arquivo .zip e fazer o download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "images.zip");
    setIsDownload(false);
    setSelectedImages({});
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
      console.log({ from: fromDateTimeUTC, to: toDateTimeUTC });
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
      <Card className="w-full max-h-[1080px] min-h-[400px] p-2 m-2 max-w-[1800px]">
        <div className="flex gap-3">
          <Tabs className="w-full h-full flex-col">
            <div className="flex gap-4 justify-between pb-2">
              <div className="flex justify-start gap-4">
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
                <TabsList>
                  <TabsTrigger value="RptAvailability" onClick={handleClear}>
                    Acessos
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
                    Câmeras
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="RptSensors" className="gap-4">
                  <div className="grid items-center justify-start grid-cols-4 gap-4 h-[10px] ">
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
                  <div className="grid items-center justify-start grid-cols-4 gap-4 h-[10px]">
                    <Select onValueChange={setSelectRpt} >
                      <SelectTrigger className="col-span-2 min-w-10">
                        <SelectValue placeholder="Selecione um Device " />
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
                <TabsContent
                  value="RptSensors"
                  className="flex gap-2 items-center align-middle"
                >
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button onClick={() => handleExecDevice()}>Consultar</Button>
                </TabsContent>
                <TabsContent value="RptIotDevices" className="flex gap-2">
                  <p className="flex items-center text-[12px] ">Download:</p>
                  {isDownload ? (
                    <Button
                      className="flex justify-center"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => downloadSelectedImages()}
                      title="Baixar"
                    >
                      <PackageOpen />
                    </Button>
                  ) : (
                    <Button
                      className="flex justify-center"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => handleDownload()}
                      title="Selecionar"
                      disabled={
                        dataReport.img?.length === 0 && !selectedImages.key
                      }
                    >
                      <Package />
                    </Button>
                  )}
                  {Object.keys(selectedImages).length !== 0 ? (
                    <Button
                      className="flex justify-center"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => setSelectedImages({})}
                      title="Desmarcar todas"
                      disabled={
                        dataReport.img?.length === 0 || isDownload === false
                      }
                    >
                      <Square />
                    </Button>
                  ) : (
                    <Button
                      className="flex justify-center"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={handleCheckAll}
                      title="Marcar todas"
                      disabled={
                        dataReport.img?.length === 0 || isDownload === false
                      }
                    >
                      <SquareCheck />
                    </Button>
                  )}
                  <Button
                    className="flex justify-end"
                    onClick={() => handleIotDevice()}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptAvailability" className="flex gap-2">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptAvailability")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptCalls" className="flex gap-2">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptCalls")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptActivities" className="flex gap-2">
                  <p className="flex items-center text-[12px]">Export:</p>
                  <PdfGerate />
                  <Button
                    className="flex justify-end"
                    onClick={() => handleMenu("RptActivities")}
                  >
                    Consultar
                  </Button>
                </TabsContent>
                <TabsContent value="RptMessages" className="flex gap-2">
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
            <div className="w-full lg:h-[300px] xl:h-[500px] xl2:h-[600px] xl3:h-[700px] overflow-auto">
              <TabsContent value="RptSensors" className="gap-4 py-4">
                {dataReport.chart.length == 0 && loadBarData.unitValue > 0 ? (
                  <div className="w-full align-middle items-center justify-center lg:h-[100px] xl:h-[100px] xl2:h-[100px] xl3:h-[100px] flex">
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
                  <div className="w-full align-middle items-center justify-center lg:h-[200px] xl:h-[300px] xl2:h-[400px] xl3:h-[500px] flex">
                    <LoaderBar
                      total={loadBarData.total}
                      unitValue={loadBarData.unitValue}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 align-middle items-center justify-center">
                    {dataReport.img.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className="relative w-[200px] h-[200px]"
                      >
                        <div className="flex">
                          <img
                            src={item.image}
                            alt={`Image ${index}`}
                            className="cursor-pointer"
                            onClick={() => handleImageClick(index)}
                          />
                          {isDownload && (
                            <Checkbox
                              className="absolute top-0 right-0"
                              checked={!!selectedImages[item.id]}
                              onCheckedChange={() =>
                                handleCheckboxChange(item.id, item.date)
                              }
                            />
                          )}
                        </div>
                        <p className="text-[12px] items-center justify-center">
                          {item.date}
                        </p>
                      </div>
                    ))}
                    {currentImageIndex !== null && (
                      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                        <Card className="items-center align-middle flex justify-center">
                          <CardContent className="w-[800px] h-[500px] relative justify-center items-center align-middle flex p-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={handlePrevImage}
                            >
                              <ArrowLeftCircle />
                            </Button>
                            <img
                              src={dataReport.img[currentImageIndex].image}
                              alt={`Image ${currentImageIndex}`}
                              className="w-[90%] h-[90%] object-contain "
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={handleNextImage}
                            >
                              <ArrowRightCircle />
                            </Button>
                            <button
                              className="absolute top-1 right-[-30px]"
                              onClick={() => setCurrentImageIndex(null)}
                            >
                              <X />
                            </button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="RptAvailability" className="gap-4 py-4">
                {dataReport.table.length == 0 ? (
                  <div className="w-full align-middle items-center justify-center lg:h-[200px] xl:h-[300px] xl2:h-[400px] xl3:h-[500px] flex">
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
                  <div className="w-full align-middle items-center justify-center lg:h-[200px] xl:h-[300px] xl2:h-[400px] xl3:h-[500px] flex">
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
                  <div className="w-full align-middle items-center justify-center lg:h-[200px] xl:h-[300px] xl2:h-[400px] xl3:h-[500px] flex">
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
                  <div className="w-full align-middle items-center justify-center lg:h-[200px] xl:h-[300px] xl2:h-[400px] xl3:h-[500px] flex">
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
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
