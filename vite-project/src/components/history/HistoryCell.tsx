import { HistoryInterface } from "./HistoryContext";
import { OctagonAlert } from "lucide-react";

interface HistoryProps {
  historyInfo: HistoryInterface;
}
export default function HistoryCell({ historyInfo }: HistoryProps) {
  return (
    <div className="py-1 px-2 flex justify-between bg-muted rounded-md my-2 items-center w-full mr-2 ">
      <div className="flex items-center gap-1 ">
        
        <div>
            <p className="text-[9px] text-muted-foreground" >tipo de noti</p>
            <p className="text-sm">{`${historyInfo.button_name} `}</p>
        </div>
        
      </div>

      <p className="text-[9px] text-muted-foreground text-wrap  mr-2 ">{`${historyInfo.date} `}</p>
    </div>
  );
}
