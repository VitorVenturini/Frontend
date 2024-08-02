import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import HistoryGrid from "../history/HistoryGrid";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OptHistory() {
  return (
    
      <ScrollArea className="h-[390px] w-full">
        <HistoryGrid />
      </ScrollArea>

  );
}
