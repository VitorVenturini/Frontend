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
import { commonClasses } from "../buttons/ButtonsComponent";

interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function SensorButton({ handleClick, button }: ButtonProps) {
  const { buttonSensors,sensors } = useSensors();
  const { setOldValue, setNewValue, buttons } = useButtons();
  const account = useAccount();

  const buttonState = buttons.find((b) => b.id === button.id);

  const oldValue = buttonState?.oldValue;
  const newValue = buttonState?.newValue;

  const filteredSensor = (account.isAdmin ? sensors : buttonSensors).find(
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

  function getDegreeRange(direction: string) {
    switch (direction) {
      case "N":
        return { min: 0, max: 22.5 };
      case "NE":
        return { min: 22.5, max: 67.5 };
      case "E":
        return { min: 67.5, max: 112.5 };
      case "SE":
        return { min: 112.5, max: 157.5 };
      case "S":
        return { min: 157.5, max: 202.5 };
      case "SW":
        return { min: 202.5, max: 247.5 };
      case "W":
        return { min: 247.5, max: 292.5 };
      case "NW":
        return { min: 292.5, max: 337.5 };
      default:
        return { min: 0, max: 0 };
    }
  }

  function isWithinRange(value: number, min: number, max: number) {
    if (min <= max) {
      return value >= min && value <= max;
    } else {
      // Handle the case where the range crosses 0 degrees (e.g., min=SE (157.5), max=E (67.5))
      return value >= min || value <= max;
    }
  }

  const getButtonClassName = () => {
    if (button?.sensor_type && filteredSensor) {
      if (button.sensor_type === "wind_direction") {
        const windRangeMin =
          button.sensor_min_threshold !== undefined
            ? getDegreeRange(button.sensor_min_threshold as string).min
            : undefined;
        const windRangeMax =
          button.sensor_max_threshold !== undefined
            ? getDegreeRange(button.sensor_max_threshold as string).max
            : undefined;

        if (
          newValue !== undefined &&
          windRangeMax !== undefined &&
          windRangeMin !== undefined &&
          !isWithinRange(newValue, windRangeMin, windRangeMax)
        ) {
          return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`;
        }
      } else {
        // quando nao for wind_direction
        const maxThreshold = button.sensor_max_threshold
          ? parseInt(button.sensor_max_threshold, 10)
          : undefined;
        const minThreshold = button.sensor_min_threshold
          ? parseInt(button.sensor_min_threshold, 10)
          : undefined;

        if (
          // if para quando for threshold que necessitam de comparação tipo co2, umidade, temperatura, etc.
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
        } else if (button.triggered) {
          return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`;
        } else {
          // quando nao está alarmando
          return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
        }
      }
    }
    return `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
  };

  const sensorModel = (account.isAdmin ? sensors : buttonSensors).filter((sensor) => {
    return sensor.deveui === button.button_prt;
  })[0];

  return (
    <div
      className={
        account.isAdmin
          ? `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`
          : getButtonClassName()
      }
      onClick={handleClick}
    >
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
