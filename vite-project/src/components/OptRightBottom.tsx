import { useButtons } from "./ButtonsContext";
import { useSensors } from "./SensorContext";
import SensorGraph from "./SensorGraph";
interface OptRightBottomProps {
  clickedButtonId: number | null;
}

export default function OptRightBottom({
  clickedButtonId,
}: OptRightBottomProps) {
  const { buttons } = useButtons();
  const { sensors } = useSensors();

  const clickedButton = buttons.find((button) => button.id === clickedButtonId);

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
            <div className="bg-gray-500 w-full">
              <h3>Sensor Device</h3>
            </div>
            <SensorGraph sensorInfo={filteredSensorInfo} />
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
