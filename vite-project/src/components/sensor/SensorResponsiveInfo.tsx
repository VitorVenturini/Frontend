import { useSensors } from "@/components/sensor/SensorContext";
import ResponsiveIcon from "./ResponsiveIcon";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";

interface ButtonProps {
  button: ButtonInterface;
  oldValue?: number;
  newValue?: number;
}

export default function SensorResponsiveInfo({
  button,
  oldValue,
  newValue,
}: ButtonProps) {
  const { sensors } = useSensors();

  const getMetric = (sensorType: string) => {
    switch (sensorType) {
      case "temperature":
        return "°C";
      case "humidity":
        return "%";
      case "co2":
        return "kg/m³";
      case "pressure":
        return "N/m²";
      default:
        return "";
    }
  };
  const formatValue = (value: number | undefined) => {
    return isNaN(value as number) ? "" : value;
  };
  return (
    <div>
      {sensors
        .filter((sensor) => sensor.sensor_name === button?.button_prt)
        .slice(0, 1) // Pega apenas o primeiro sensor filtrado
        .map((sensor, index) => (
          <div className="flex items-center gap-1 justify-between" key={index}>
            <div className="flex items-center">
            <ResponsiveIcon
              oldValue={oldValue}
              newValue={newValue}
              sensorType={button.sensor_type}
            />
            <p className="text-[10px] font-medium leading-none text-muted-foreground">
              {button.sensor_type}
            </p>
            </div>
            

            <div className="flex gap-1">
              <div className="flex items-center gap-1">
                <p>
                  {/* {newValue !== undefined ? formatValue(newValue) : formatValue((sensor as any)[`${button.sensor_type}`])} */}
                  {newValue !== undefined
                    ? formatValue(newValue)
                    : formatValue((sensor as any)[`${button.sensor_type}`])}
                </p>
                <p className="text-[8px] text-muted-foreground">
                  {getMetric(button?.sensor_type as any)}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
