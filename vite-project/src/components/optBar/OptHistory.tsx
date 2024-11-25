import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, HistoryInterface } from "../history/HistoryContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { parse } from "date-fns";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { Loader2 } from "lucide-react";
import { replaceDataForName, replaceSipForName } from "../utils/utilityFunctions";
import { useUsers } from "../users/usersCore/UserContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { filterButtonByID } from "../utils/utilityFunctions";
import { useSensors } from "../sensor/SensorContext";
import { getText } from "../utils/utilityFunctions";
import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";
import ResponsiveHistoryInfo from "../history/ResponsiveHistoryInfo";

interface HistoryCellProps {
  historyInfo: HistoryInterface;
}

const HistoryCell: React.FC<HistoryCellProps> = ({ historyInfo }) => {
  const { users } = useUsers();
  const { sensors } = useSensors();
  const { buttons } = useButtons();
  const { language } = useLanguage();
  const details = historyInfo.details;
  
  return (
    <div className="flex flex-col bg-muted w-[500px] xl2:w-[700px] xl4:w-[1000px] mt-2 ">
      <div className="flex gap-1 bg-card/50 px-2 py-1 justify-between items-center">
        <div className="flex gap-1 ">
          <p className="text-sm  font-black">
            {historyInfo.name === 'call' ? replaceSipForName(users, historyInfo.from) :
            replaceDataForName(users, historyInfo.from, sensors)}
          </p>
          <p className="text-sm text-muted-foreground">
            {getText("to", texts[language])}
          </p>
          <p className="text-sm text-fuchsia">
            {historyInfo.name === 'call' ? replaceSipForName(users, historyInfo.prt) : replaceDataForName(users, historyInfo.guid, sensors)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-sm ">
            {filterButtonByID(details.id, buttons)}
          </p>
        </div>

      </div>
      <ResponsiveHistoryInfo historyInfo={historyInfo} />
    </div>
  );
};


const HistoryGrid: React.FC<{ history: HistoryInterface[] }> = ({
  history,
}) => {

  const sortedHistory = [...history]
    .filter((entry) => entry?.date)
    .sort((a, b) => {
      try {
        const dateA = parse(a.date, "yyyy-MM-dd HH:mm:ss.SSS XXX", new Date());
        const dateB = parse(b.date, "yyyy-MM-dd HH:mm:ss.SSS XXX", new Date());
        return dateB.getTime() - dateA.getTime();
      } catch (error) {
        console.error("Error parsing date:", error, { a, b });
        return 0;
      }
    });

  return (
    <>
      {sortedHistory?.map((hist, index) => (
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
  const { language } = useLanguage();
  useEffect(() => {
    const sortedItems = [...history].sort(
      (a, b) => parseInt(a?.id) - parseInt(b?.id)
    );
    setItems(sortedItems);
  }, [history]);

  const fetchMoreData = () => {
    if (items.length >= history?.length) {
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
      <>
        {items.length > 0 ? (
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
                    {getText("load", texts[language]) +
                      " " +
                      getText("plus", texts[language])}
                  </>
                ) : (
                  <>
                    {getText("load", texts[language]) +
                      " " +
                      getText("plus", texts[language])}
                  </>
                )}
              </Button>
            }
            endMessage={
              <>
                {historyComplete && (
                  <p style={{ textAlign: "center" }}>
                    <b>{getText("historyEnd", texts[language])}</b>
                  </p>
                )}
              </>
            }
          >
            <HistoryGrid history={items} />
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: "center" }}>
            <b>{getText("noHistory", texts[language])}</b>
          </p>
        )}
      </>
    </ScrollArea>
  );
};

export default OptHistory;
