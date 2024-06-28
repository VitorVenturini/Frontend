import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { Rss } from "lucide-react";
import SensorResponsiveInfo from "@/components/sensor/SensorResponsiveInfo";
import { useSensors } from "./SensorContext";
import { useEffect } from "react";
import ResponsivePng from "./ResponsivePng";

interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function SensorButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const { setOldValue, setNewValue, buttons } = useButtons();

  const buttonState = buttons.find((b) => b.id === button.id);

  const oldValue = buttonState?.oldValue;
  const newValue = buttonState?.newValue;

  const filteredSensor = sensors.find(
    (sensor) => sensor.sensor_name === button?.button_prt
  );

  useEffect(() => {
    if (button?.sensor_type && filteredSensor) {
      const value = parseInt((filteredSensor as any)[button.sensor_type], 10);
      if (newValue !== value) {
        setOldValue(button.sensor_type, button.button_prt, newValue); // Armazena o valor antigo antes de atualizar
        setNewValue(button.sensor_type, button.button_prt, value); // Atualiza o valor novo
      }
    }
  }, [filteredSensor, button?.sensor_type, newValue]);

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

      if (
        (maxThreshold !== undefined && newValue && newValue > maxThreshold) ||
        (minThreshold !== undefined && newValue && newValue < minThreshold)
      ) {
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`;
      } else if (minThreshold === undefined || maxThreshold === undefined) {
        console.log("Threshold não definido para este botão.");
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
      } else {
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
      }
    }
    return commonClasses;
  };

  const sensorModel = sensors.filter((sensor) =>{
    return sensor.sensor_name === button.button_prt
  })[0]
  
  return (
    <div className={getButtonClassName()} onClick={handleClick}>
      <div className="flex items-center gap-1 cursor-pointer justify-between">
        <div>
          <p className="text-sm font-medium leading-none">
            {button.button_name}
          </p>
          <p className="text-[10px] font-medium leading-none text-muted-foreground">
            {button.button_prt}
          </p>
        </div>
        <ResponsivePng sensorModel={sensorModel?.description} />
      </div>
      <SensorResponsiveInfo
        button={button}
        oldValue={oldValue}
        newValue={newValue}
      />
    </div>
  );
}
