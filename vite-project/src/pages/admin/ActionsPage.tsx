import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/actions/data-tableActions";
import { columnsActions } from "@/components/actions/ColumnsActions";
import { Action } from "@radix-ui/react-toast";
import { useActions } from "@/components/actions/ActionsContext";

export default function ActionsPage() {
  //const [actions, setActions] = useState<ActionsInteface[]>([]);
  const columnsactions = columnsActions; // Certifique-se de que ColumnsActions esteja correto

  const { actions } = useActions();
  console.log('TABLE ACTIONS GATEWAY', actions)
  return (
    <div className="px-2 flex flex-col gap-4 justify-center mx-[20px]">
      <ScrollArea className="w-full lg:h-[500px] xl:h-[600px] xl2:h-[700px] xl3:h-[800px] xl4:h-[900px]">
        <DataTable columns={columnsactions as any} data={actions as any} />
      </ScrollArea>
    </div>
  );
}
