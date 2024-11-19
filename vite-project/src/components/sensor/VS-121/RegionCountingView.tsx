import { MoveLeft, MoveRight, PersonStanding } from "lucide-react";

interface RegionCountingView {
  people_count_all: number;
  region_count: number;
  people_count_max: number;
  date: string;
}
interface RegionCountingViewProps {
  availableParams: RegionCountingView[];
}

export default function RegionCountingView({
  availableParams,
}: RegionCountingViewProps) {
  const sortedParams = [...availableParams]?.sort((a, b) => {
    const dateA = new Date(a?.date || "").getTime();
    const dateB = new Date(b?.date || "").getTime();
    return dateB - dateA; // Ordena do maior para o menor
  });

  const latestData = sortedParams[0] || {
    people_count_all: 0,
    region_count: 0,
    people_count_max: 0,
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="flex items-center justify-center flex-col w-full m-5">
        {/* Contagem Total */}
        <div className="flex w-full">
          <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
            <span>Contagem Total</span>
            <div className="flex items-center gap-2">
              <span>{latestData.people_count_all}</span>
              <PersonStanding />
            </div>
          </div>
        </div>

        {/* Contagem Máxima */}
        <div className="flex w-full">
          <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
            <span>Contagem Máxima</span>
            <div className="flex items-center gap-2">
              <span>{latestData.people_count_max}</span>
              <PersonStanding />
            </div>
          </div>
        </div>

        {/* Contagem de Região */}
        <div className="flex w-full">
          <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
            <span>Contagem de Região</span>
            <div className="flex items-center gap-2">
              <span>{latestData.region_count}</span>
              <PersonStanding />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
