import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHistory } from "./HistoryContext";
import { useEffect } from "react";
import HistoryCell from "./HistoryCell";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { checkButtonWarning } from "../utils/utilityFunctions";
import { useSensors } from "../sensor/SensorContext";
import { format, parse } from "date-fns";

export default function HistoryGrid() {
  const { history, addHistory } = useHistory();
  const { buttons } = useButtons();
  const { buttonSensors } = useSensors();

  const buttonState = buttons.filter((b) => b.button_type === "sensor");
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/mm hh:mm");

  useEffect(() => {
    buttonState.forEach((btn) => {
      const isWarning = checkButtonWarning(btn, btn.newValue);
      const filteredSensor = buttonSensors.find(
        (sensor) => sensor.deveui === btn.button_prt
      );
      if (isWarning) {
        addHistory({
          message: `${filteredSensor?.sensor_name} Disparou`,
          date: format(new Date(filteredSensor?.date as string), "dd/MM HH:mm"),
          type: "sensor"
        });
      }
    });
  }, [buttonSensors]);

  // ordenar por data 
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = parse(a.date, "dd/MM HH:mm", new Date()); 
    const dateB = parse(b.date, "dd/MM HH:mm", new Date());
    return dateB.getTime() - dateA.getTime(); 
  });

  return (
    <>
      {sortedHistory.map((hist, index) => (
        <div key={index} className="w-full">
          <HistoryCell historyInfo={hist} />
        </div>
      ))}
    </>
  );
}
