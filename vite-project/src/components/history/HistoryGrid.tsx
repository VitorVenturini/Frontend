import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHistory } from "./HistoryContext";
import { useEffect } from "react";
import HistoryCell from "./HistoryCell";

export default function HistoryGrid() {
  const { history } = useHistory();
  // useEffect(() => {
  //   console.log("Contexto atualizado" + JSON.stringify(history));
  // }, [history]);

  return (
      <ScrollArea className="w-full min-h-[390px] max-h-[390px]">
        {history.map((hist, index) => (
          <div key={index} className="w-full ">
            <HistoryCell historyInfo={hist} />
          </div>
        ))}
      </ScrollArea>
  );
}
