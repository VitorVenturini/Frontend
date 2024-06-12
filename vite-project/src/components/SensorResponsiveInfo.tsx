import { useSensors } from "./SensorContext";
import ResponsiveIcon from "./ResponsiveIcon";
import { ButtonInterface } from "@/components/ButtonsContext";

interface ButtonProps {
  button: ButtonInterface;
}

export default function SensorResponsiveInfo({ button }: ButtonProps) {
  const { sensors } = useSensors();
  console.log("Novos Sensores" + JSON.stringify((sensors)))

  function isBoolean(value: string): boolean {
    return value === 'true' || value === 'false';
  }

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


  return (
    <div>
      {sensors
        .filter((sensor) => sensor.sensor_name === button?.button_prt)
        .slice(0, 1) // Pega apenas o primeiro sensor filtrado
        .map((sensor, index) => (
          <div className="flex items-center gap-1 justify-between">
            <p className="text-[10px] font-medium leading-none text-muted-foreground">
              {button.sensor_type}
            </p>

            <div className="flex gap-1">
              <div className="flex items-center gap-1">
                <p className="">
                  {button.sensor_type && isBoolean(sensor[`${button.sensor_type}`]) 
                    ? sensor[`${button.sensor_type}`] === null
                    : sensor[`${button.sensor_type}`]}
                </p>
                <p className="text-[8px] text-muted-foreground">
                  {getMetric(button.sensor_type)}
                </p>
              </div>
              <ResponsiveIcon isBoolean={button.sensor_type && isBoolean(sensor[`${button.sensor_type}`])} sensorType={button.sensor_type}/>
            </div>
          </div>
        ))}
    </div>
  );
}
