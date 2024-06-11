import {
    Check,
    CircleArrowDown,
    CircleArrowUp,
    X
  } from "lucide-react";
  
  interface ResponsiveIconProps {
    isBoolean?: boolean;
    sensorType?: string;
  }
  
  export default function ResponsiveIcon({ isBoolean, sensorType }: ResponsiveIconProps) {
    if (isBoolean === true) {
      return <Check size={20} color="green" />;
    } else if (isBoolean === false) {
      return <X size={20} color="red" />;
    } else {
      if (sensorType === 'temperature') {
        return <CircleArrowDown size={20} color="red" />;
      } else {
        return <CircleArrowUp size={20} color="green" />;
      }
    }
  }