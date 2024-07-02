import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { Rss } from "lucide-react";
import SensorResponsiveInfo from "@/components/sensor/SensorResponsiveInfo";
import ResponsivePng from "@/components/sensor/ResponsivePng";
import { useAccount } from "@/components/account/AccountContext";
import { useSensors } from "@/components/sensor/SensorContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function CommandButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const account = useAccount();
  const wss = useWebSocketData();

  const sensorModel = sensors.filter((sensor) => {
    return sensor.devEUI === button.button_device;
  })[0];

  const commonClasses =
    "w-[128px] h-[55px] rounded-lg border bg-border text-white shadow-sm p-1 bg-buttonSensor active:bg-red-800";

  const handleClickCommand = () => {
    handleClick();
    if (!account.isAdmin) {
      wss?.sendMessage({
        api: "user",
        mt: "TriggerCommand",
        btn_id: button.id,
      });
    }
  };
  return (
    <div className={commonClasses} onClick={handleClickCommand}>
      <div className="flex items-center gap-1 cursor-pointer justify-between">
        <div>
          <p className="text-sm font-medium leading-none">
            {button.button_name}
          </p>
          <p className="text-[10px] font-medium leading-none text-muted-foreground">
            {button.button_prt}
          </p>
        </div>
        <ResponsivePng
          sensorModel={
            account.isAdmin ? sensorModel?.description : (button.img as any)
          }
        />
      </div>
      
    </div>
  );
}
