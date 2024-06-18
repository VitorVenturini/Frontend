import { CircleArrowDown, CircleArrowUp } from "lucide-react";

interface ResponsiveIconProps {
  oldValue?: number;
  newValue?: number;
}

export default function ResponsiveIcon({
  oldValue,
  newValue,
}: ResponsiveIconProps) {
  console.log("OldValueParaComparar" + oldValue);
  console.log("NewValueParaComparar" + newValue);
  if (oldValue === undefined || newValue === undefined) {
    return null; // No icon if values are not defined
  }

  if (oldValue < newValue) {
    return <CircleArrowUp size={20} color="green" />;
  } else if (oldValue > newValue) {
    return <CircleArrowDown size={20} color="red" />;
  }
  //else {
  //     return <Check size={20} color="green" />;
  //   }
}
