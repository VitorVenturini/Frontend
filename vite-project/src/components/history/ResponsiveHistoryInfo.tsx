import { HistoryInterface } from "./HistoryContext";
import { getText } from "../utils/utilityFunctions";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";
import { format, parseISO } from "date-fns";
import { Image } from "lucide-react";

interface HistoryCellProps {
  historyInfo: HistoryInterface;
}

export const createHistoryContent = (
  name: string,
  status?: string,
  prt?: string
) => {
  let badgeVariant: string =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ";
  let content: any;

  switch (name) {
    case "message":
      badgeVariant +=
        "border-transparent bg-blue-900 text-blue-100 hover:bg-blue-800";
      content = <Image />;
      break;
    case "alarm":
      badgeVariant +=
        "border-transparent bg-yellow-900 text-yellow-100 hover:bg-yellow-800";
      content = "🚨 Alerta de Alarme";
      break;
    case "threshold":
      badgeVariant +=
        "border-transparent bg-red-900 text-red-100 hover:bg-red-800";
      content = `Limite: ${prt}`;
      break;
    case "button":
      if(prt?.startsWith("press_")){
        badgeVariant +=
        "border-transparent bg-purple-900 text-red-100 hover:bg-purple-800";
      content = `Limite: ${prt}`;
      }
    break;
    default:
      badgeVariant +=
        "border-transparent bg-gray-900 text-gray-100 hover:bg-gray-800";
      content = prt;
  }

  return { badgeVariant, content };
};

export default function ResponsiveHistoryInfo({
  historyInfo,
}: HistoryCellProps) {
  const { language } = useLanguage();

  const truncatedPrt =
    historyInfo?.prt?.length > 20
      ? `${historyInfo.prt.slice(0, 20)}...`
      : historyInfo.prt;

  let formattedDate = "Invalid date";
  try {
    const parsedDate = parseISO(historyInfo.date);
    formattedDate = format(new Date(historyInfo.date as any), "dd/MM HH:mm");
  } catch (error) {
    console.error("Error parsing date:", error);
  }

  return (
    <>
      <div className=" flex justify-between rounded-md my-2 items-center px-2 py-1">
        <div className="flex items-center gap-1 capitalize">
          <span className={createHistoryContent(historyInfo?.name,null,historyInfo?.prt).badgeVariant}>
            {historyInfo.name
              ? getText(historyInfo.name, texts[language])
              : historyInfo.name}
          </span>
          <p className="text-sm capitalize ">
            {historyInfo.status
              ? getText(historyInfo.status, texts[language])
              : historyInfo.status}
          </p>
          <p className="text-sm font-black ">
            {truncatedPrt
              ? getText(truncatedPrt, texts[language])
              : truncatedPrt}
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-wrap mr-2">
          {formattedDate}
        </p>
      </div>
    </>
  );
}
