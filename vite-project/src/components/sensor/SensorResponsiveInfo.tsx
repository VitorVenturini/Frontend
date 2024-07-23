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

  const handleSensorSpecificValue = (sensorType: string, value: any) => {
    let formattedValue;
    let metric;

    switch (sensorType) {
      case "leak":
        formattedValue = value === 0 ? "Normal" : "Alagado";
        metric = "";
        break;
      case "magnet_status":
        formattedValue = value === 1 ? "Open" : "Closed";
        metric = "";
        break;
      case "temperature":
        formattedValue = value;
        metric = "°C";
        break;
      case "humidity":
        formattedValue = value;
        metric = "%";
        break;
      case "co2":
        formattedValue = value;
        metric = "kg/m³";
        break;
      case "pressure":
        formattedValue = value;
        metric = "N/m²";
        break;
      default:
        formattedValue = value;
        metric = "";
        break;
    }
    
    return { formattedValue, metric };
  };

  const formatValue = (value: number | undefined, sensorValue: any) => {
    if (isNaN(value as number)) {
      return handleSensorSpecificValue(button.sensor_type as any, sensorValue);
    } else {
      return handleSensorSpecificValue(button.sensor_type as any, value);
    }
  };

  return (
    <div>
      {sensors
        .filter((sensor) => sensor.deveui === button?.button_prt)
        .slice(0, 1) // Pega apenas o primeiro sensor filtrado
        .map((sensor, index) => {
          const { formattedValue, metric } = formatValue(
            newValue,
            (sensor as any)[`${button.sensor_type}`]
          );

          return (
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
                      {formattedValue}
                    </p>
                  )}
                  <p className="text-[8px] text-muted-foreground">
                    {metric}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
