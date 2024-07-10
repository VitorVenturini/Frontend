import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/Reports/data-tableActions";
import { columnsActions } from "@/Reports/ColumnsActions";
import { Action } from "@radix-ui/react-toast";
import { useActions } from "@/components/actions/ActionsContext";

export default function ActionsPage() {
  //const [actions, setActions] = useState<ActionsInteface[]>([]);
  const columnsactions = columnsActions; // Certifique-se de que ColumnsActions esteja correto
 
  const {actions} = useActions()
  return (
    <div className="px-2 flex flex-col gap-4 justify-center mx-[20px]">
      <ScrollArea className="w-full h-full">
        <DataTable columns={columnsactions} data={actions} />
      </ScrollArea>
    </div>
  );
}