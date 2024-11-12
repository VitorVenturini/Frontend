import { SensorInterface } from "../SensorContext";

interface LineCrossingViewProps {
  availableParams: SensorInterface[];
}

export default function LineCrossingView({
  availableParams,
}: LineCrossingViewProps) {
  // Ordenar os parâmetros disponíveis por data, do mais recente para o mais antigo
  const sortedParams = [...availableParams].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA; // Ordena do maior para o menor
  });

  return (
    <div>
    
        <div>
          <div>People In: {sortedParams[0].people_in}</div>
          <div>People Out: {sortedParams[0].people_out}</div>
          <div>People Total In: {sortedParams[0].people_total_in}</div>
          <div>People Total Out: {sortedParams[0].people_total_out}</div>
          {/* <div>Date: {param.date}</div> */}
          <hr />
        </div>

    </div>
  );
}
