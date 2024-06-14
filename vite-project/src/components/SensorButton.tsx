import { ButtonInterface } from "./ButtonsContext";
import { Rss } from "lucide-react";
import SensorResponsiveInfo from "./SensorResponsiveInfo";
import { useSensors } from "./SensorContext";
import { useState, useEffect } from "react";
interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function SensorButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const [oldValue, setOldValue] = useState<number | undefined>();
  const [newValue, setNewValue] = useState<number | undefined>();

  const filteredSensor = sensors.filter(
    (sensor) => sensor.sensor_name === button?.button_prt
  )[0];

  useEffect(() => {
    if (button?.sensor_type && filteredSensor) {
      const value = parseInt((filteredSensor as any)?.[button.sensor_type], 10);
      setNewValue((prevNewValue) => {
        if (prevNewValue !== value) {
          setOldValue(prevNewValue);
          return value;
        }
        return prevNewValue;
      });
    }
  }, [filteredSensor, button?.sensor_type]);

  console.log("Valor Antigo " + oldValue);
  console.log("Valor Novo " + newValue);

  const commonClasses =
    "w-[128px] h-[55px] rounded-lg border bg-border text-white shadow-sm p-1";

  const getButtonClassName = () => {
    if (button?.sensor_type && filteredSensor) {
      const maxThreshold = button.sensor_max_threshold
        ? parseInt(button.sensor_max_threshold, 10)
        : undefined;
      const minThreshold = button.sensor_min_threshold
        ? parseInt(button.sensor_min_threshold, 10)
        : undefined;
      //const currentValue = parseInt((filteredSensor as any)?.[button.sensor_type]);

      if (
        (maxThreshold !== undefined && newValue && newValue > maxThreshold) ||
        (minThreshold !== undefined && newValue && newValue < minThreshold)
      ) {
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800`;
      } else if (minThreshold === undefined || maxThreshold === undefined) {
        console.log("Threshold não definido para este botão.");
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
      } else {
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
      }
    }
    // Return default class if no sensor type or filtered sensor
    return commonClasses;
  };

  return (
    <div className={getButtonClassName()} onClick={handleClick}>
      <div className="flex items-center gap-1 cursor-pointer">
        <Rss size={20} />
        <div>
          <p className="text-md font-medium leading-none">
            {button.button_name}
          </p>
          <p className="text-[10px] font-medium leading-none text-muted-foreground">
            {button.button_prt}
          </p>
        </div>
      </div>
      <SensorResponsiveInfo
        button={button}
        oldValue={oldValue}
        newValue={newValue}
      />
    </div>
  );
}
