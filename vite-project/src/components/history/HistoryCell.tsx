import { HistoryInterface } from "./HistoryContext";
import { OctagonAlert } from "lucide-react";

interface HistoryProps {
  historyInfo: HistoryInterface;
}
export default function HistoryCell({ historyInfo }: HistoryProps) {
  return (
    <div className="py-2 px-2 flex justify-between bg-muted rounded-md my-2 items-center w-full mr-2 ">
      <div className="flex items-center gap-1 ">
            <p className="text-sm">{`${historyInfo.message} `}</p>
      </div>
      <p className="text-sm text-muted-foreground text-wrap  mr-2 ">{`${historyInfo.date} `}</p>
    </div>
  );
}
