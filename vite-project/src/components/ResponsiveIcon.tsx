import { CircleArrowDown, CircleArrowUp } from "lucide-react";

interface ResponsiveIconProps {
  oldValue?: number;
  newValue?: number;
  sensorType?: string | null;
}

export default function ResponsiveIcon({ oldValue, newValue, sensorType }: ResponsiveIconProps) {
  console.log("OldValueParaComparar" + oldValue)
  console.log("NewValueParaComparar" + newValue)
  if (oldValue !== undefined && newValue !== undefined) {
    if (newValue > oldValue) {
      return <CircleArrowUp size={20} color="green" />;
    } else if (newValue < oldValue) {
      return <CircleArrowDown size={20} color="red" />;
    }
  }

  // Default case if no changes in value
  return null;
}
