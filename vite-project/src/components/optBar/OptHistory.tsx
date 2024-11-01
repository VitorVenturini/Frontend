import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, HistoryInterface } from "../history/HistoryContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { parse } from "date-fns";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import { replaceDataForName } from "../utils/utilityFunctions";
import { useUsers } from "../users/usersCore/UserContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { filterButtonByID } from "../utils/utilityFunctions";
import { useSensors } from "../sensor/SensorContext";
import { getText } from "../utils/utilityFunctions";
import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";

interface HistoryCellProps {
  historyInfo: HistoryInterface;
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        threshold:
          "border-transparent bg-red-900 text-red-100 hover:bg-red-800",
        status:
          "border-transparent bg-green-900 text-green-100 hover:bg-green-800",
        alarm:
          "border-transparent bg-yellow-900 text-yellow-100 hover:bg-yellow-800",
        message:
          "border-transparent bg-blue-900 text-blue-100 hover:bg-blue-800",
        default:
          "border-transparent bg-gray-900 text-gray-100 hover:bg-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const HistoryCell: React.FC<HistoryCellProps> = ({ historyInfo }) => {
  const { users } = useUsers();
  const { sensors } = useSensors();
  const { buttons } = useButtons();
  const { language } = useLanguage();

  const isValidVariant = (
    variant: string
  ): variant is "threshold" | "status" | "alarm" | "message" | "default" => {
    return ["threshold", "status", "alarm", "message", "default"].includes(
      variant
    );
  };

  const badgeVariant = badgeVariants({
    variant: isValidVariant(historyInfo.name) ? historyInfo.name : "default",
  });

  let formattedDate = "Invalid date";
  try {
    const parsedDate = parseISO(historyInfo.date);
    formattedDate = format(new Date(historyInfo.date as any), "dd/mm HH:mm");
  } catch (error) {
    console.error("Error parsing date:", error);
  }
  const truncatedPrt =
    historyInfo?.prt?.length > 20
      ? `${historyInfo.prt.slice(0, 20)}...`
      : historyInfo.prt;

  return (
    <div className="flex flex-col bg-muted w-[500px] xl2:w-[700px] xl4:w-[1000px] mt-2 ">
      <div className="flex gap-1 bg-card/50 px-2 py-1 justify-between items-center">
        <div className="flex gap-1 ">
          <p className="text-sm text-muted-foreground font-black">
            {replaceDataForName(users, historyInfo.from, sensors)}
          </p>
          <p className="text-sm text-muted-foreground">{getText('to', texts[language])}</p>
          <p className="text-sm text-foreground font-black">
            {replaceDataForName(users, historyInfo.guid, sensors)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-sm ">
            {filterButtonByID(historyInfo.details, buttons)}
          </p>
        </div>
      </div>
      <div className=" flex justify-between rounded-md my-2 items-center px-2 py-1">
        <div className="flex items-center gap-1 capitalize">
          <span className={badgeVariant}>
            {historyInfo.name
              ? getText(historyInfo.name, texts[language])
              : historyInfo.name}
          </span>
          <p className="text-sm capitalize ">
            {historyInfo.status
              ? getText(historyInfo.status, texts[language])
              : historyInfo.status}
          </p>
          <p className="text-sm font-black ">
            {truncatedPrt
              ? getText(truncatedPrt, texts[language])
              : truncatedPrt}
          </p>

        </div>
        <p className="text-sm text-muted-foreground text-wrap mr-2">
          {formattedDate
            ? getText(formattedDate, texts[language])
            : formattedDate}
        </p>
      </div>
    </div>
  );
};

const HistoryGrid: React.FC<{ history: HistoryInterface[] }> = ({
  history,
}) => {
  // ordenar por data
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = parse(a.date, "yyyy-MM-dd HH:mm:ss.SSS X", new Date());
    const dateB = parse(b.date, "yyyy-MM-dd HH:mm:ss.SSS X", new Date());
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      {sortedHistory.reverse().map((hist, index) => (
        <div key={index} className="w-full gap-1 space-x-1">
          <HistoryCell historyInfo={hist} />
        </div>
      ))}
    </>
  );
};

const OptHistory: React.FC = () => {
  const { history, historyComplete } = useHistory();
  const [items, setItems] = useState<HistoryInterface[]>(history);
  const hasMore = !historyComplete;
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sortedItems = [...history].sort(
      (a, b) => parseInt(a.id) - parseInt(b.id)
    );
    setItems(sortedItems);
  }, [history]);

  const fetchMoreData = () => {
    if (items.length >= history.length) {
      // setHasMore(false);
      return;
    }
  };

  // Função para adicionar mais itens manualmente
  const addMoreItems = () => {
    setIsLoading(true);
    wss?.sendMessage({
      api: "user",
      mt: "getHistory",
      startId: items[0].id,
    });
    setIsLoading(false);
  };

  return (
    <ScrollArea className="w-full lg:h-[310px] xl:h-[340px] xl2:h-[380px] xl3:h-[480px] xl4:h-[500px]  relative justify-center align-middle items-center">
      <InfiniteScroll
        dataLength={items.length}
        className="justify-center align-middle items-center flex flex-col"
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Button
            onClick={addMoreItems}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregar mais
              </>
            ) : (
              "Carregar mais"
            )}
          </Button>
        }
        endMessage={
          <>
            {historyComplete && (
              <p style={{ textAlign: "center" }}>
                <b>Fim do histórico</b>
              </p>
            )}
          </>
        }
      >
        <HistoryGrid history={items} />
      </InfiniteScroll>
    </ScrollArea>
  );
};

export default OptHistory;
