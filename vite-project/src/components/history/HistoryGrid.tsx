import { useHistory } from "./HistoryContext";
import HistoryCell from "./HistoryCell";
import {parse } from "date-fns";

export default function HistoryGrid() {
  const { history, addHistory } = useHistory();

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
