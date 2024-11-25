import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { Rss } from "lucide-react";
import SensorResponsiveInfo from "@/components/sensor/SensorResponsiveInfo";

import { useAccount } from "@/components/account/AccountContext";
import { useSensors } from "@/components/sensor/SensorContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { commonClasses } from "../ButtonsComponent";
import LogoCore from "../../../assets/Vector.svg";

interface ButtonProps {
  handleClick?: () => void;
  button: ButtonInterface;
}

export default function CommandButton({ handleClick, button }: ButtonProps) {
  const { sensors } = useSensors();
  const { buttons, setButtonLoading, setStopCombo } = useButtons();
  const account = useAccount();
  const wss = useWebSocketData();
  //const [isLoading, setIsLoading] = useState(false);
  const [initiatedByUser, setInitiatedByUser] = useState(false);
  const [clickedClass, setClickedClass] = useState("");
  const buttonClass =
    button.button_name.length < 10
      ? "text-md xl3:text-xl xl4:text-3xl"
      : "text-[9px] xl3:text-sm xl4:text-md";

  const handleClickCommand = () => {
    if (button.loading) return; // impede novos cliques enquanto está carregando
    handleClick?.();
    setInitiatedByUser(true);
    if (!account.isAdmin) {
      wss?.sendMessage({
        api: "user",
        mt: "TriggerCommand",
        btn_id: button.id,
      });
    }
    setButtonLoading(button.id, true);
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
    if (!initiatedByUser) {
      // nao foi iniciado por um usuario
      if (button.loading) return; // se estiver carregando entao nao deixa ativar o commando
      if (button.comboStart) {
        // RECEBEU UM COMBO
        //setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCommand",
          btn_id: button.id,
        });
        setButtonLoading(button.id, true);
      }
    } else {
      setInitiatedByUser(false);
    }
  }, [button.comboStart]); // so vai ativar quando tiver troca de valor

  // const buttonState = buttons.find((b) => b.id === button.id);
  // const commandValue = buttonState?.commandValue;

  useEffect(() => {
    console.log("value " + button.commandValue);
    setButtonLoading(button.id, false);
    if (button.comboStart) {
      // parar o combo se ele tiver ativo
      setStopCombo(button.id); // pois precisamos ver se o valor do button.comboStart mudou para ativar o UseEffect acima
    }
  }, [button.commandValue]); // quando vier o novo valor do botão command ( quando vier o ControllerReceived)

  return (
    <div
      className={`${commonClasses} bg-buttonSensor flex flex-col cursor-pointer w-full`}
      onClick={handleClickCommand}
    >
      <div>
        <p className={`font-medium leading-none ${buttonClass}`}>
          {button.button_name}
        </p>
        <p className="text-[10px] font-medium leading-none text-muted-foreground xl4:text-md">
          {button.button_prt}
        </p>
      </div>
      <div className="flex justify-end">
        {!account.isAdmin && (
          <div>
            {button.loading ? (
              <img src={LogoCore} className="mr-2 h-8 animate-spin" />
            ) : (
              <Switch checked={button.commandValue === "on"} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
