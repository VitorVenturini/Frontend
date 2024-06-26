import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHistory } from "./HistoryContext";
import { useEffect } from "react";

export default function HistoryGrid() {
  const { history } = useHistory();
  // useEffect(() => {
  //   console.log("Contexto atualizado" + JSON.stringify(history));
  // }, [history]);

  return (
    <Card className="p-1 flex flex-col gap-1 items-center min-h-[390px] max-h-[390px]">
      <ScrollArea>
        {history.map((hist, index) => (
          <div key={index}>
            <p>{`${hist.button_name}: ${hist.date}`}</p>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
