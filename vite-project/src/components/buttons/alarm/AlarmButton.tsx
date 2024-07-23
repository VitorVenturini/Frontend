import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { OctagonAlert } from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";

interface ButtonProps {
  button: ButtonInterface;
  handleClick: () => void;
}

export default function AlarmButton({ button, handleClick }: ButtonProps) {
  const [clickedClass, setClickedClass] = useState("");
  const { buttons, setClickedButton, removeClickedButton, setButtonTriggered, setStopButtonTriggered } =
    useButtons();
  const account = useAccount();
  const wss = useWebSocketData();
  const [initiatedByUser, setInitiatedByUser] = useState(false);
  const commonClasses =
    "w-[128px] h-[60px] md:w-[128px] md:h-[60px]  lg:w-[128px] lg:h-[60px]  xl:w-[128px] xl:h-[60px] xl2:w-[150px] xl2:h-[80px] rounded-lg border bg-border text-white shadow-sm p-1";
  // fazer um isTriggered para quando for alarmado mudar de cor
  // useEffect(() => {
  //   if (button.triggered) {
  //     setClickedClass("bg-red-800");
  //     // handleClickAlarm()
  //   } else {
  //     setClickedClass("");
  //   }
  // }, [button.triggered]);
  // //button.triggered

  useEffect(() => {
    if (!initiatedByUser) { // quando nao foi iniciado pelo usuario
      if (button.triggered && !button.clicked) {  // quando o usuario recebeu um alarme
        setClickedClass("bg-red-800");
      } else if (button.triggered && button.clicked) { // quando o usuario disparou um combo
        setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      } else { // quando alguem desativou o alarme do usuario
        setClickedClass("");
      }
    } else { 
      setInitiatedByUser(false); 
    }
  }, [button.triggered]);

  const handleClickAlarm = () => {
    handleClick();
    setInitiatedByUser(true);
    if (!account.isAdmin) {
      const isClicked = button.clicked;
      //isClicked || 
      if (button.triggered) {
        removeClickedButton(button.id);
        setClickedClass("");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerStopAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      }
      else if (isClicked && !button.triggered) {
        setClickedButton(button.id);
        setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      }
      else {
        setClickedButton(button.id);
        setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      }
    }
  };
  // active:bg-green-950
  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer bg-green-700 ${clickedClass}`}
      onClick={handleClickAlarm}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <OctagonAlert />
        <p className="text-sm font-medium leading-none">{button.button_name}</p>
      </div>
      <div>
        <p>{button.button_prt}</p>
      </div>
    </div>
  );
}
