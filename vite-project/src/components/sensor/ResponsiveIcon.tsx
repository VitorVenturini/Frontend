import { Thermometer,CircleGauge,Droplets,Cloudy } from "lucide-react";

interface ResponsiveIconProps {
  oldValue?: number;
  newValue?: number;
  sensorType?: string | null;
}

export default function ResponsiveIcon({
  oldValue,
  newValue,
  sensorType,
}: ResponsiveIconProps) {
  console.log("OldValueParaComparar" + oldValue);
  console.log("NewValueParaComparar" + newValue);
  switch (sensorType) {
    case "temperature":
      return <Thermometer className="p-0.5"/>;
    case "humidity":
      return <Droplets className="p-0.5"/>;
    case "co2":
      return <Cloudy className="p-0.5"/>;
    case "pressure":
      return <CircleGauge className="p-0.5"/>;
    default:
      return "";
  }

  // if (oldValue < newValue) {
  //   return <CircleArrowUp size={20} color="green" />;
  // } else if (oldValue > newValue) {
  //   return <CircleArrowDown size={20} color="red" />;
  // }
  //else {
  //     return <Check size={20} color="green" />;
  //   }
}
