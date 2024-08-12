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

  const sensorModel = (account.isAdmin ? sensors : buttonSensors).filter((sensor) => {
    return sensor.deveui === button.button_prt;
  })[0];

  const getButtonClassName = () => {
    return checkButtonWarning(button, newValue)
      ? `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-red-800 blinking-background`
      : `${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`;
  };

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
