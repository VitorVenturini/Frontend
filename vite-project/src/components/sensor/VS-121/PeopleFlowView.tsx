import { SensorInterface } from "../SensorContext";

interface PeopleFlowViewProps {
  availableParams: SensorInterface[];
}

export default function PeopleFlowView({
  availableParams,
}: PeopleFlowViewProps) {
  const sortedParams = [...availableParams]?.sort((a, b) => {
    const dateA = new Date(a?.date || "").getTime();
    const dateB = new Date(b?.date || "").getTime();
    return dateB - dateA; // Ordena do maior para o menor
  });

  return (
    <div>
      <div>a_to_a: {sortedParams[0]?.a_to_a}</div> <div>AAAAA</div>
    </div>
  );
}
