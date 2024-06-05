import { useButtons } from "./ButtonsContext";
import { useSensors } from "./SensorContext";
import SensorGraph from "./SensorGraph";
import SensorGrid from "./SensorGrid"
import { useState } from "react";
import BatteryGauge from 'react-battery-gauge'

interface OptRightBottomProps {
  clickedButtonId: number | null;
  onKeyChange: (key: string) => void;
}

export default function OptRightBottom({
  clickedButtonId,
}: OptRightBottomProps) {
  const { buttons } = useButtons();
  const { sensors } = useSensors();
  const [sensorKey, setSensorKey] = useState<string>("");
  const [clickedKey, setClickedKey] = useState<string | null>(null);


  const clickedButton = buttons.find((button) => button.id === clickedButtonId);

  const handleKeyChange = (key: string) => {
    setSensorKey(key); 
  };

  const renderButtonInfo = () => {
    if (!clickedButton) return null;

    switch (clickedButton.button_type) {
      case "sensor":
        const filteredSensorInfo = sensors.filter(
          (sensor) => sensor.sensor_name === clickedButton.button_prt
        );
        console.log("FilteredSensor" + JSON.stringify(filteredSensorInfo));
        return (
          <div className="w-full">

            <SensorGrid sensorInfo = {filteredSensorInfo} onKeyChange={handleKeyChange } clickedKey={clickedKey} setClickedKey={setClickedKey} />
            <SensorGraph sensorInfo={filteredSensorInfo} sensorKey = {sensorKey}  />
            {/* <SensorGraph sensorInfo={filteredSensorInfo} /> */}
            {/* {filteredSensorInfo.map((sensor) => (
              <div>
                <div>Nome do Sensor: {sensor?.sensor_name}</div>
                <div>Bateria: {sensor?.battery}</div>
                <div>Temperatura: {sensor?.temperature}</div>
                <div>CO²: {sensor?.co2}</div>
              </div>
            ))} */}
          </div>
        );
      case "floor":
      case "map":
      case "radio":
      case "video":
      case "chat":

      default:
        return null;
    }
  };

  return renderButtonInfo();
}
