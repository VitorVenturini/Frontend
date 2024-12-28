import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/actions/data-tableActions";
import { columnsActions } from "@/components/actions/ColumnsActions";
import { Action } from "@radix-ui/react-toast";
import { useActions } from "@/components/actions/ActionsContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

export default function ActionsPage() {
  //const [actions, setActions] = useState<ActionsInteface[]>([]);
  const columnsactions = columnsActions; // Certifique-se de que ColumnsActions esteja correto
  const wss = useWebSocketData();

  const { actions } = useActions();
  console.log('TABLE ACTIONS GATEWAY', actions)

  useEffect(() =>{
    wss.sendMessage({
      api: "admin",
      mt: "SelectActions"
    })
  },[])
  
  return (
    <div className="flex flex-col px-12 xl2:px-20 justify-center">
      <ScrollArea className="lg:h-[500px] xl:h-[670px] xl2:h-[770px] xl3:h-[870px] xl4:h-[900px]">
        <DataTable columns={columnsactions as any} data={actions as any} />
      </ScrollArea>
    </div>
  );
}
