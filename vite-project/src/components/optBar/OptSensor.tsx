import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SensorGraph from "@/components/sensor/SensorGraph";
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
  sensorKey,
  filteredSensorInfo,
  handleKeyChange,
  setClickedKey,
  clickedKey,
}: OptSensorProps) {
  return (
    <Card className="h-full flex">

      <SensorGrid
        sensorInfo={filteredSensorInfo}
        onKeyChange={handleKeyChange}
        clickedKey={clickedKey}
        setClickedKey={setClickedKey}
      />
      {sensorKey && (
        <SensorGraph sensorInfo={filteredSensorInfo} sensorKey={sensorKey} />
      )}
    </Card>
  );
}
