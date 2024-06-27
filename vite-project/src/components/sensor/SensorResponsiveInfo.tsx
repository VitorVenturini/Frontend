import { useSensors } from "@/components/sensor/SensorContext";
import ResponsiveIcon from "./ResponsiveIcon";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { useAccount } from "../account/AccountContext";

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
  const account = useAccount();

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
  const formatValue = (value: number | undefined, sensorValue: any) => {
    if (isNaN(value as number)) {
      return handleSensorSpecificValue(button.sensor_type as any, sensorValue);
    } else {
      return handleSensorSpecificValue(button.sensor_type as any, value);
    }
  };

  const handleSensorSpecificValue = (sensorType: string, value: any) => {
    switch (sensorType) {
      case "leak":
        return value === "normal" ? "Normal" : "Alagado";
      case "magnet_status":
        return value === 1 ? "Open" : "Closed";
      default:
        return value;
    }
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
                {!account.isAdmin && (
                  <p className="text-sm">
                    {formatValue(
                      newValue,
                      (sensor as any)[`${button.sensor_type}`]
                    )}
                  </p>
                )}
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
