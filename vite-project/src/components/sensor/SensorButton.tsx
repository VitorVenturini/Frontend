import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { Rss } from "lucide-react";
import SensorResponsiveInfo from "@/components/sensor/SensorResponsiveInfo";
import { useSensors } from "./SensorContext";
import { useEffect } from "react";
import ResponsivePng from "./ResponsivePng";
import { useAccount } from "../account/AccountContext";

interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function SensorButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const { setOldValue, setNewValue, buttons } = useButtons();
  const account = useAccount();

  const buttonState = buttons.find((b) => b.id === button.id);

  const oldValue = buttonState?.oldValue;
  const newValue = buttonState?.newValue;

  console.log("Todos Sensores " + JSON.stringify(sensors));

  const filteredSensor = sensors.find(
    (sensor) => sensor.deveui === button?.button_prt
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
    "w-[128px] h-[60px] md:w-[128px] md:h-[60px]  lg:w-[128px] lg:h-[60px]  xl:w-[128px] xl:h-[60px] xl2:w-[150px] xl2:h-[80px] rounded-lg border bg-border text-white shadow-sm p-1";

  const getButtonClassName = () => {
    if (button?.sensor_type && filteredSensor) {
      const maxThreshold = button.sensor_max_threshold
        ? parseInt(button.sensor_max_threshold, 10)
        : undefined;
      const minThreshold = button.sensor_min_threshold
        ? parseInt(button.sensor_min_threshold, 10)
        : undefined;

      if (
        // if para quando for threshold que necessitam de comparação tipo co2, umidade,temperatura..etc
        (maxThreshold !== undefined &&
          maxThreshold !== 0 &&
          maxThreshold !== 1 &&
          newValue &&
          newValue > maxThreshold) ||
        (minThreshold !== undefined &&
          minThreshold !== 0 &&
          minThreshold !== 1 &&
          newValue &&
          newValue < minThreshold)
      ) {
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`;
      } else if (
        // else if para quando for valores 0 e 1
        newValue == maxThreshold
      ) {
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`;
      } else {
        // quando nao está alarmando
        return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
      }
    }
    return commonClasses;
  };

  const sensorModel = sensors.filter((sensor) => {
    return sensor.deveui === button.button_prt;
  })[0];

  return (
    <div className={getButtonClassName()} onClick={handleClick}>
      <div className="flex items-center gap-1 cursor-pointer justify-between">
        <div>
          <p className="text-sm font-medium leading-none">
            {button.button_name}
          </p>
          <p className="text-[10px] font-medium leading-none text-muted-foreground">
            {sensorModel ? sensorModel.sensor_name : ""}
          </p>
        </div>
        <ResponsivePng
          sensorModel={
            account.isAdmin ? sensorModel?.description : (button.img as any)
          }
        />
      </div>
      <SensorResponsiveInfo
        button={button}
        oldValue={oldValue}
        newValue={newValue}
      />
    </div>
  );
}
