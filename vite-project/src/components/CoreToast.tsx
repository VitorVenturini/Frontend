import { Card } from "@/components/ui/card";
import LogoWecom2 from "@/assets/LogoWecom2.svg";
import { useHistory } from "./history/HistoryContext";

export default function CoreToast() {
  const {history} = useHistory()
  return (
    <Card className="p-1 w-full flex items-center align-middle justify-between">
      {history.length > 0 ? history[0].message : "" }
    </Card>
  );
}
