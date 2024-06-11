import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/Reports/data-table";
import { ColumnsActions } from "@/Reports/ColumnsActions";
import { WebSocketProvider } from "@/components/WebSocketProvider";

interface Action {
  id: string;
  name: string;
  start_type: string;
  prt: string;
  alarm_code: string;
  user: string;
  device: string;
}
interface WebSocketMessage {
  api : string
  mt: string; // Message type
  [key: string]: any; // Additional dynamic properties
}

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const columnsactions = ColumnsActions; // Certifique-se de que ColumnsActions esteja correto

  const listActions = async () => {
    try {
      const response = await fetch("https://meet.wecom.com.br/api/listUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data: Action[] = await response.json();
        setActions(data); // Atualiza o estado com os dados recebidos
      } else {
        console.error('Erro na resposta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    listActions();
  }, []);

  return (
    <div className="px-2 flex flex-col gap-4 justify-center mx-[250px]">
      <ScrollArea className="h-[500px]">
        <DataTable columns={columnsactions} data={actions} />
      </ScrollArea>
    </div>
  );
}
