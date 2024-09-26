import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, HistoryInterface } from "../history/HistoryContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { parse } from "date-fns";
import { useWebSocketData } from "../websocket/WebSocketProvider";

interface HistoryCellProps {
  historyInfo: HistoryInterface;
}

const HistoryCell: React.FC<HistoryCellProps> = ({ historyInfo }) => {
  return (
    <div className="py-2 px-2 flex justify-between bg-muted rounded-md my-2 items-center w-full mr-2 ">
      <div className="flex items-center gap-1 ">
        <p className="text-sm">{`${historyInfo.name} `}</p>
        <p className="text-sm">{`${historyInfo.prt}`}</p>
        <p className="text-sm">{`${historyInfo.id}`}</p>
      </div>
      <p className="text-sm text-muted-foreground text-wrap mr-2 ">{`${historyInfo.date} `}</p>
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
        <div key={index} className="w-full">
          <HistoryCell historyInfo={hist} />
        </div>
      ))}
    </>
  );
};

const OptHistory: React.FC = () => {
  const { history } = useHistory();
  const [items, setItems] = useState<HistoryInterface[]>(history);
  const [hasMore, setHasMore] = useState(true);
  const wss = useWebSocketData();

  useEffect(() => {
    const sortedItems = [...history].sort(
      (a, b) => parseInt(a.id) - parseInt(b.id)
    );
    setItems(sortedItems);
  }, [history]);

  const fetchMoreData = () => {
    if (items.length >= history.length) {
      setHasMore(false);
      return;
    }
  };

  // Função para adicionar mais itens manualmente
  const addMoreItems = () => {
    wss?.sendMessage({
      api: "user",
      mt: "getHistory",
      startId: items[0].id,
    });
  };

  return (
    <ScrollArea className="w-full lg:h-[310px] xl:h-[340px] xl2:h-[380px] xl3:h-[480px] xl4:h-[500px] relative">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You have seen it all!</b>
          </p>
        }
      >
        <HistoryGrid history={items} />
      </InfiniteScroll>
      <Button onClick={addMoreItems}>Carregar mais</Button>
    </ScrollArea>
  );
};

export default OptHistory;
