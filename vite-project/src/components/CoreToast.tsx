import { Card } from "@/components/ui/card";
import LogoWecom2 from "@/assets/LogoWecom2.svg";
import {
  useHistory,
  HistoryInterface,
} from "@/components/history/HistoryContext";

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format, parseISO, parse } from "date-fns";
import { useWebSocketData } from "./websocket/WebSocketProvider";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import {
  replaceDataForName,
  replaceSipForName,
} from "./utils/utilityFunctions";
import { useUsers } from "./users/usersCore/UserContext";
import {
  ButtonInterface,
  useButtons,
} from "./buttons/buttonContext/ButtonsContext";
import { filterButtonByID } from "./utils/utilityFunctions";
import { useSensors } from "./sensor/SensorContext";
import { getText } from "./utils/utilityFunctions";
import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";
import { createHistoryContent } from "./history/ResponsiveHistoryInfo";

interface HistoryCellProps {
  historyInfo: HistoryInterface;
}
const calculateDuration = (
  connected: string | null,
  ended: string | null
): string => {
  if (!connected || !ended) return "00:00"; // Garantir que as datas sejam válidas

  const start = new Date(connected);
  const end = new Date(ended);
  const durationInMs = end.getTime() - start.getTime(); // Diferença em milissegundos
  const durationInSeconds = Math.floor(durationInMs / 1000); // Converter para segundos

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  // Formatar para mm:ss
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
const HistoryCell: React.FC<HistoryCellProps> = ({ historyInfo }) => {
  const { users } = useUsers();
  const { buttonSensors } = useSensors();
  const { buttons } = useButtons();
  const { language } = useLanguage();
  

  const recordLink = historyInfo?.details?.record_link;
  const isLinkAvailable = recordLink;
  const duration = calculateDuration(
    historyInfo?.details.call_connected,
    historyInfo?.details.call_ended
  );
  let formattedDate: string;
  if (historyInfo?.date) {
    formattedDate = format(new Date(historyInfo?.date as any), "dd/MM HH:mm");
  }

  const truncatedPrt =
    historyInfo?.prt?.length > 20
      ? `${historyInfo?.prt.slice(0, 20)}...`
      : historyInfo?.prt;

  return (
    <div className="flex justify-between bg-card  items-center p-2 w-full border px-3">
      <div className="flex items-center gap-1 capitalize">
        <span
          className={
            createHistoryContent(historyInfo?.name, null, historyInfo?.prt)
              .badgeVariant
          }
        >
          {historyInfo?.name
            ? getText(historyInfo?.name, texts[language])
            : historyInfo?.name}
        </span>

        <p className="text-sm font-black ">
          {historyInfo?.name === "call"
            ? replaceSipForName(users, historyInfo.prt)
            : truncatedPrt
            ? createHistoryContent(
                historyInfo.name,
                historyInfo.status,
                historyInfo.prt,
                language,
                historyInfo.details
              ).content
            : truncatedPrt}
        </p>
        <p className="text-sm capitalize ">
          {historyInfo?.status
            ? createHistoryContent(
                historyInfo?.name,
                historyInfo?.status,
                historyInfo?.prt,
                language,
                historyInfo?.details
              ).statusValue
            : historyInfo?.status}
        </p>
        <p>
        {historyInfo?.name === "call" && (
            <div className="flex justify-between rounded-md items-center px-2 py-1">
              <div className="flex items-center gap-1 capitalize">
                <p className="text-sm font-bold">{getText('durationTxt', texts[language]) + duration}</p>
              </div>
            </div>
          )}
        </p>  
      </div>

      <div className="flex j gap-2 justify-end">
        <p className="text-sm ">
          {filterButtonByID(historyInfo?.details.id, buttons)}
        </p>

        <p className="text-sm text-muted-foreground text-wrap mr-2">
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

const CoreToast: React.FC = () => {
  const { history, historyComplete } = useHistory();
  const [items, setItems] = useState<HistoryInterface[]>(history);
  const hasMore = !historyComplete;
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sortedItems = [...history]?.sort(
      (a, b) => parseInt(a?.id) - parseInt(b?.id)
    );
    setItems(sortedItems);
  }, [history]);

  return <HistoryCell historyInfo={items[items.length - 1]} />;
};
export default CoreToast;
