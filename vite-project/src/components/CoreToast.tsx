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
import { replaceDataForName } from "./utils/utilityFunctions";
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

const HistoryCell: React.FC<HistoryCellProps> = ({ historyInfo }) => {
  const { users } = useUsers();
  const { buttonSensors } = useSensors();
  const { buttons } = useButtons();
  const { language } = useLanguage();

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
          {truncatedPrt
            ? createHistoryContent(
                historyInfo?.name,
                historyInfo?.status,
                historyInfo?.prt,
                language,
                historyInfo?.details,
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
      </div>

      <div className="flex j gap-2 justify-end">
        <p className="text-sm ">
          {filterButtonByID(historyInfo?.details?.toString(), buttons)}
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
