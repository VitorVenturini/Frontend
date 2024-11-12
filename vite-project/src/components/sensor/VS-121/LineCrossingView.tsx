import { MoveLeft, MoveRight, PersonStanding } from "lucide-react";
import { SensorInterface } from "../SensorContext";

interface LineCrossingViewProps {
  availableParams: SensorInterface[];
}

export default function LineCrossingView({
  availableParams,
}: LineCrossingViewProps) {
  // Ordenar os parâmetros disponíveis por data, do mais recente para o mais antigo
  const sortedParams = [...availableParams]?.sort((a, b) => {
    const dateA = new Date(a?.date || "").getTime();
    const dateB = new Date(b?.date || "").getTime();
    return dateB - dateA; // Ordena do maior para o menor
  });

  return (
    sortedParams && (
      <div className="flex gap-2 w-full">
        <div className="flex items-center justify-center flex-col w-full m-5">
          <div className="flex w-full">
            <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
              IN <span>{<MoveRight />}</span>{" "}
              <span>{sortedParams[0]?.people_in}</span>
            </div>
            <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
              TOTAL IN
              <div className="flex">
              <span>{sortedParams[0]?.people_total_in}</span>
              <span>{<PersonStanding />}</span>
              </div>
            </div>
          </div>
          <div className="flex w-full">
            <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
              OUT 
              <span>{<MoveLeft />}</span>{" "}
              <span>{sortedParams[0]?.people_out}</span>
            </div>
            <div className="bg-muted p-5 m-2 flex gap-2 w-full items-center justify-between">
              TOTAL OUT
              <div className="flex">
              <span>{sortedParams[0]?.people_total_out}</span>
              <span>{<PersonStanding />}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
