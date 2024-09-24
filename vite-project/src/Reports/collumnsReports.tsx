import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-tableReports"; // Ajuste o caminho conforme necessário
import { Play, Download } from "lucide-react";
import { host } from "@/App";
import { AudioPlayer } from "react-audio-player-component"; // Substitua pela biblioteca de áudio que você está usando
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { getText } from "@/components/utils/utilityFunctions";

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
  const columns: ColumnDef<any, any>[] = useMemo(() => {
    // Filtra as colunas que não devem ser exibidas
    const baseColumns: ColumnDef<any, any>[] = keys
      .filter(
        (key) =>
          key !== "record_link" &&
          key !== "record_id" &&
          key !== "btn_id" &&
          key !== "call_innovaphone"
      )
      .map((key) => ({
        accessorKey: key,
        header: key.toUpperCase(),
      }));

    if (report === "RptCalls") {
      baseColumns.push({
        accessorKey: "ACTIONS",
        header: "ACTIONS",
        cell: ({ row }: { row: any }) => {
          const [isPlaying, setIsPlaying] = useState(false);
          const recordLink = row.original.record_link;

          const isLinkAvailable = recordLink && recordLink.trim() !== "";

          return isPlaying && isLinkAvailable ? (
            <div className="flex items-center gap-2">
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
            </div>
          ) : (
            <div className="flex space-x-2">
              <Play
                className={`cursor-pointer ${
                  !isLinkAvailable && "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => isLinkAvailable && setIsPlaying(true)}
              />
              <a
                href={`${host}${recordLink}`}
                download
                onClick={(e) => {
                  if (!isLinkAvailable) {
                    e.preventDefault(); // Previne o comportamento padrão se o link não estiver disponível
                  }
                }}
              >
                <Download
                  className={`cursor-pointer ${
                    !isLinkAvailable && "opacity-50 cursor-not-allowed"
                  }`}
                />
              </a>
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [keys, report]);

  return (
    <div className="space-y-2">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {report ? getText(report, texts[language]) :  texts[language].report}
      </h4>
      <DataTable columns={columns} data={data} filter={filter} />
    </div>
  );
};

export default ColumnsReports;
