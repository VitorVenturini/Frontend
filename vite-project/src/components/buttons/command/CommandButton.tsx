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
import { commonClasses } from "../ButtonsComponent";
interface ButtonProps {
  handleClick: () => void;
  button: ButtonInterface;
}

export default function CommandButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const { buttons, setStopCombo } = useButtons();
  const account = useAccount();
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState(false);
  const [initiatedByUser, setInitiatedByUser] = useState(false);
  const [clickedClass, setClickedClass] = useState("");

  const handleClickCommand = () => {
    if (isLoading) return; // impede novos cliques enquanto está carregando
    handleClick();
    setInitiatedByUser(true);
    if (!account.isAdmin) {
      wss?.sendMessage({
        api: "user",
        mt: "TriggerCommand",
        btn_id: button.id,
      });
    }
    setIsLoading(true);
    // //const isClicked = button.clicked;
    // if (button.triggered) {
    //   removeClickedButton(button.id);
    //   // setClickedClass("");
    //   wss?.sendMessage({
    //     api: "user",
    //     mt: "TriggerStopCommand",
    //     btn_id: button.id,
    //   });
    // } else {
    //setClickedButton(button.id);
    //setClickedClass("bg-red-800");

    //}
  };

  useEffect(() => {
    if (!initiatedByUser) { // nao foi iniciado por um usuario
      if (isLoading) return; // se estiver carregando entao nao deixa ativar o commando 
      if (button.comboStart) { // RECEBEU UM COMBO
        //setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCommand",
          btn_id: button.id,
        });
        setIsLoading(true);
      }
    } else {
      setInitiatedByUser(false);
    }
  }, [button.comboStart]); // so vai ativar quando tiver troca de valor 

  const buttonState = buttons.find((b) => b.id === button.id);
  const commandValue = buttonState?.commandValue;

  useEffect(() => {
    setIsLoading(false);
    if (button.comboStart) { // parar o combo se ele tiver ativo 
      setStopCombo(button.id) // pois precisamos ver se o valor do button.comboStart mudou para ativar o UseEffect acima 
    }
  }, [commandValue]); // quando vier o novo valor do botão command ( quando vier o ControllerReceived)

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
          <p className=" text-sm font-medium leading-none capitalize mt-1 items-center flex">
            {commandValue}
            {!account.isAdmin && (
              <div>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Switch className="h-5" checked={commandValue === "on"} />
                )}
              </div>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
