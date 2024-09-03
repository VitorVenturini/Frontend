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
      <ScrollArea className="w-full h-[200px]  lg:h-[290px]  xl2:h-[400px] xl4:h-[590px]  relative">
        <HistoryGrid />
      </ScrollArea>
  );
}
