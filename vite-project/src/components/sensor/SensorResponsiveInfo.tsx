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

  function getWindDirection(degrees: number) {
    if (degrees >= 0 && degrees < 22.5) {
      return "N";
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return "NE";
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return "E";
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return "SE";
    } else if (degrees >= 157.5 && degrees < 202.5) {
      return "S";
    } else if (degrees >= 202.5 && degrees < 247.5) {
      return "SW";
    } else if (degrees >= 247.5 && degrees < 292.5) {
      return "W";
    } else if (degrees >= 292.5 && degrees < 337.5) {
      return "NW";
    } else if (degrees >= 337.5 && degrees <= 360) {
      return "N";
    } else {
      return "Invalid direction";
    }
  }

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
      case "tamper_status":
        formattedValue = value === 1 ? "Não Instalado" : "Instalado";
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
      case "wind_direction":
        formattedValue = getWindDirection(value);
        metric = "";
        break;
      case "wind_speed":
        formattedValue = value
        metric = "km/h";
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
            <div
              className="flex items-center gap-1 justify-between"
              key={index}
            >
              <div className="flex items-center">
                <ResponsiveIcon
                  sensorType={button.sensor_type}
                />
                <p className="text-[10px] font-medium leading-none text-muted-foreground">
                  {button.sensor_type}
                </p>
              </div>

              <div className="flex gap-1">
                <div className="flex items-center gap-1">
                  {!account.isAdmin && (
                    <p className="text-sm">{formattedValue}</p>
                  )}
                  <p className="text-[8px] text-muted-foreground">{metric}</p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
