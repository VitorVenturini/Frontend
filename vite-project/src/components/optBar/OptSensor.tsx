import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SensorTest } from "../sensor/SensorTest";
import { Grafico } from "../charts/lineChart";

import { SensorGraph } from "../sensor/SensorGraph";
import { SensorInterface } from "../sensor/SensorContext";
import SensorGrid from "../sensor/SensorGrid";
interface OptSensorProps {
  filteredSensorInfo: SensorInterface[];
  handleKeyChange: (key: string) => void;
  sensorKey: string;
  setClickedKey: (key: string | null) => void;
  clickedKey: string | null;
}
export default function OptSensor({
  filteredSensorInfo,
}: OptSensorProps) {

  const sortObjectKeys = (obj: any) => {
    return Object.keys(obj)
      .sort() // Ordena as chaves em ordem alfabética
      .reduce((result: any, key) => {
        result[key] = obj[key]; // Reconstroi o objeto com as chaves ordenadas
        return result;
      }, {});
  };

  const sortArrayOfObjects = (arr: any[]) => {
    return arr.map((item) => sortObjectKeys(item));
  };
  // passar o array ordenado para o gráfico .
  const sortedChartData = sortArrayOfObjects(filteredSensorInfo)
  //console.log("sortedChartData" + JSON.stringify(sortedChartData))
  return (
    <Card className="h-full flex">
      <SensorGraph chartData={sortedChartData.reverse()} />
    </Card>
  );
}
