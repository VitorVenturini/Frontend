import { useButtons } from "./ButtonsContext";
import { useSensors } from "./SensorContext";
import SensorGraph from "./SensorGraph";
import SensorGrid from "./SensorGrid";
import { useState, useEffect } from "react";
import BatteryGauge from "react-battery-gauge";
import VideoPlayer from "./VideoPlayer";

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
  const [loading, setLoading] = useState<boolean>(true);

  const clickedButton = buttons.find((button) => button.id === clickedButtonId);

  useEffect(() => {
    if (clickedButton) {
      const sensorName = clickedButton.button_prt;
      const filteredSensorInfo = sensors.filter(
        (sensor) => sensor.sensor_name === sensorName
      );
      if (filteredSensorInfo.length > 0) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [clickedButton, sensors]);

  const handleKeyChange = (key: string) => {
    setSensorKey(key);
  };

  const renderButtonInfo = () => {
    if (!clickedButton) return null;

    switch (clickedButton.button_type) {
      case "sensor":
        if (loading) {
          return <div>Carregando dados do sensor...</div>;
        } else {
          const filteredSensorInfo = sensors.filter(
            (sensor) => sensor.sensor_name === clickedButton.button_prt
          );
          console.log("AllSensors " + JSON.stringify(sensors));
          console.log("FilteredSensor" + JSON.stringify(filteredSensorInfo));
          return (
            <div className="w-full">
              <SensorGrid
                sensorInfo={filteredSensorInfo}
                onKeyChange={handleKeyChange}
                clickedKey={clickedKey}
                setClickedKey={setClickedKey}
              />
              <SensorGraph
                sensorInfo={filteredSensorInfo}
                sensorKey={sensorKey}
              />
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
        }
      case "floor":
      case "map":
      case "radio":
      case "video":
        return (
          <div className="w-full">
            <VideoPlayer url={clickedButton.button_prt} />
          </div>
        );
      case "chat":

      default:
        return null;
    }
  };

  return renderButtonInfo();
}
