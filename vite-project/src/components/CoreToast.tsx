import { Card } from "@/components/ui/card";
import LogoWecom2 from "@/assets/LogoWecom2.svg";
import { useHistory } from "./history/HistoryContext";
import { format } from "date-fns";
export default function CoreToast() {
  const {history} = useHistory()
  return (
    <Card className="p-1 w-full flex items-center align-middle justify-between h-[35px]">
      {history.length > 0 ? history[0].name + " - " + format(new Date(history[0].date), "dd/MM \n HH:mm") : "" }
    </Card>
  );
}
