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
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function CommandButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const { buttons } = useButtons();
  const account = useAccount();
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState(false);

  const commonClasses =
    "w-[128px] h-[55px] rounded-lg border bg-border text-white shadow-sm p-1 bg-buttonSensor active:bg-red-800";

  const handleClickCommand = () => {
    //colocar o spin ao clicar
    handleClick();
    if (!account.isAdmin) {
      wss?.sendMessage({
        api: "user",
        mt: "TriggerCommand",
        btn_id: button.id,
      });
      setIsLoading(true)
    }
  };
  const buttonState = buttons.find((b) => b.id === button.id);
  const commandValue = buttonState?.commandValue;

  useEffect(() =>{
    setIsLoading(false)
  },[commandValue]) // quando vier o novo valor do botão command ( quando vier o ControllerReceived)
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
          <p className=" text-sm font-medium leading-none capitalize mt-1 items-center flex gap-3">
            {commandValue}
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Switch
                className="h-5"
                checked={commandValue === "on"}
              />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
