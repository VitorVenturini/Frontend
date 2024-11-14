import { MoveRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Square from "./DirectionalSquare";
import { format } from "date-fns";
interface PeopleFlowParameters {
  a_to_a: number;
  a_to_b: number;
  a_to_c: number;
  a_to_d: number;
  b_to_a: number;
  b_to_b: number;
  b_to_c: number;
  b_to_d: number;
  c_to_a: number;
  c_to_b: number;
  c_to_c: number;
  c_to_d: number;
  d_to_a: number;
  d_to_b: number;
  d_to_c: number;
  d_to_d: number;
  date: string;
}

interface PeopleFlowViewProps {
  availableParams: PeopleFlowParameters[];
}

export default function PeopleFlowView({
  availableParams,
}: PeopleFlowViewProps) {
  // Ordena os parâmetros pela data, do mais recente para o mais antigo
  const sortedParams = [...availableParams].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA;
  });

  // Extrai os movimentos de direção com contagem > 0 para exibição
  const flowData = sortedParams.flatMap((entry) =>
    Object.entries(entry)
      .filter(
        ([key, value]) =>
          key !== "timestamp" &&
          key !== "date" &&
            Number(value) > 0 && // Garante que a contagem seja maior que zero
          key.includes("_to_")
      )
      .map(([key, value]) => {
        const [from, to] = key.split("_to_");
        return { from, to, date: entry.date, count: value };
      })
  );
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[55%] flex items-center justify-center">
      <Square data={sortedParams[0]} />
      </div>
      <ScrollArea className="w-[45%] flex flex-col m-2 mt-4 space-y-2 h-full mb-5">
        {flowData.map((flow, index) => (
          <div
            key={index}
            className="bg-muted p-5 w-full mb-2 flex justify-between items-center relative"
          >
            <span className="absolute top-1 left-1 text-xs text-muted-foreground">
              {format(new Date(flow?.date), "dd/MM HH:mm")}
            </span>
            <div className="flex gap-3">
              <span>{flow.from.toUpperCase()}</span>
              <MoveRight />
              <span>{flow.to.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-lg font-semibold">{flow.count}</span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
