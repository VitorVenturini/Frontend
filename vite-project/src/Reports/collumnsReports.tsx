import React, { useMemo, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-tableReports"; // Ajuste o caminho conforme necessário
import { Play, Download } from "lucide-react";
import { host } from "@/App";
import { AudioPlayer } from "react-audio-player-component"; // Substitua pela biblioteca de áudio que você está usando
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { getText } from "@/components/utils/utilityFunctions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Captions } from "lucide-react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import LogoCore from "../assets/Vector.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface ColumnsReportsProps {
  report: string;
  data: any[];
  keys: string[];
  filter: string;
}

const ColumnsReports: React.FC<ColumnsReportsProps> = ({
  report,
  data,
  keys,
  filter,
}) => {
  const { language } = useLanguage();
  const wss = useWebSocketData();
  // Adiciona estado para controlar o carregamento
  const handleTranscriptionCall = (id: number) => {
    //setLoading(true)
    console.log("Transcrição enviada:", id);
    wss?.sendMessage({
      api: "admin",
      mt: "GetTranscription",
      call: id,
    });
  };

  const columns: ColumnDef<any, any>[] = useMemo(() => {
    // Filtra as colunas que não devem ser exibidas
    const baseColumns: ColumnDef<any, any>[] = keys
      .filter(
        (key) =>
          key !== "record_link" &&
          key !== "record_id" &&
          key !== "btn_id" &&
          key !== "text" &&
          key !== "call_innovaphone"
      )
      .map((key) => ({
        accessorKey: key,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {getText(key, texts[language]).toUpperCase()}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      }));

    if (report === "RptCalls") {
      baseColumns.push({
        accessorKey: "ACTIONS",
        header: "ACTIONS",
        cell: ({ row }: { row: any }) => {
          const recordLink = row.original.record_link;
          const transcript = row.original.text;
          const isLinkAvailable = recordLink && recordLink.trim() !== "";
          const isTranscripAvailable =
            transcript !== null && transcript.trim() !== "";
          const [loading, setLoading] = useState(false);
          return (
            <div className="flex justify-between">
              <Popover>
                <PopoverTrigger disabled={!isLinkAvailable}>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!isLinkAvailable}
                  >
                    <Play />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] flex justify-between align-middle items-center">
                  <AudioPlayer
                    src={`${host}${recordLink}`}
                    minimal={true}
                    width={300}
                    trackHeight={20}
                    barWidth={1}
                    gap={2}
                    visualise={false}
                    backgroundColor="#1e293b"
                    barColor="#1e293b"
                    barPlayedColor="#ffffff"
                    skipDuration={2}
                    showLoopOption={false}
                    showVolumeControl={false}
                  />
                  <Button variant="ghost" size="icon">
                    <a
                      href={`${host}${recordLink}`}
                      download
                      onClick={(e) => {
                        if (!isLinkAvailable) {
                          e.preventDefault(); // Previne o comportamento padrão se o link não estiver disponível
                        }
                      }}
                    >
                      <Download />
                    </a>
                  </Button>
                </PopoverContent>
              </Popover>
              <Dialog>
                <DialogTrigger disabled={!isLinkAvailable}>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!isLinkAvailable}
                  >
                    <Captions />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    Transcrição da Chamada {row.original.id}
                  </DialogHeader>
                  <DialogDescription className="text-8">
                    {isLinkAvailable
                      ? transcript === ""
                        ? getText("callNoTalk", texts[language])
                        : transcript === "noTranscription"
                        ? getText("noTranscription", texts[language])
                        : transcript
                      : getText("noTranscription", texts[language])}
                  </DialogDescription>
                  <DialogFooter className="flex justify-end">
                    {!isTranscripAvailable &&
                      isLinkAvailable &&
                      transcript !== "" &&
                      (
                        <Button
                          disabled={loading}
                          onClick={() => {
                            handleTranscriptionCall(row.original.id);
                            setLoading(true)
                          }}
                        >
                            
                          {loading ? (<img src={LogoCore} className="h-6 animate-spin" />)
                          : (getText("transcript", texts[language]))}
                        </Button>
                      )}
                  </DialogFooter>
                  <DialogClose>
                    
                  </DialogClose>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger disabled={!isLinkAvailable}></PopoverTrigger>
                <PopoverContent></PopoverContent>
              </Popover>
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [keys, report]);

  return (
    <div className="space-y-2">
      <h4 className="scroll-m-20 text-xl flex font-semibold tracking-tight justify-center">
        {report ? getText(report, texts[language]) : texts[language].report}
      </h4>
      <DataTable columns={columns} data={data} filter={filter} />
    </div>
  );
};

export default ColumnsReports;
