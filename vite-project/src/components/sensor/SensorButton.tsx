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
import { checkButtonWarning } from "../utils/utilityFunctions";

interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function SensorButton({ handleClick, button }: ButtonProps) {
  const { buttonSensors, sensors } = useSensors();
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

  const sensorModel = (account.isAdmin ? sensors : buttonSensors).filter(
    (sensor) => {
      return sensor.deveui === button.button_prt;
    }
  )[0];

  const getButtonClassName = () => {
    return checkButtonWarning(button, newValue)
      ? `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`
      : `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
  };

  return (
    <div
      className={
        account.isAdmin
          ? `${commonClasses} flex flex-col justify-between cursor-pointer active:bg-red-900 bg-buttonSensor`
          : getButtonClassName()
      }
      onClick={handleClick}
    >
      <div className="flex items-center  gap-1 cursor-pointer ">
        <ResponsivePng
          sensorModel={
            account.isAdmin ? sensorModel?.description : (button.img as any)
          }
        />
        <p className=" flex text-sm font-medium leading-none xl3:text-2xl">{button.button_name}</p>
      </div>
      <p className="text-[9px] font-medium leading-none text-muted-foreground">
        {sensorModel ? sensorModel.sensor_name : ""}
      </p>
      <SensorResponsiveInfo 
        button={button}
        oldValue={oldValue}
        newValue={newValue}
      />

    </div>
  );
}
