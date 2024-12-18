import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { OctagonAlert } from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";
import { commonClasses } from "../ButtonsComponent";

interface ButtonProps {
  button: ButtonInterface;
  handleClick?: () => void;
}

export default function AlarmButton({ button, handleClick }: ButtonProps) {
  const [clickedClass, setClickedClass] = useState("");
  const { setClickedButton, removeClickedButton } = useButtons();
  const account = useAccount();
  const wss = useWebSocketData();
  const [initiatedByUser, setInitiatedByUser] = useState(false);

  const buttonClass =
    button.button_name.length < 10
      ? "text-md xl3:text-xl xl4:text-3xl"
      : "text-[9px] xl3:text-sm xl4:text-md";

  useEffect(() => {
    if (!initiatedByUser) {
      // quando nao foi iniciado pelo usuario
      if (button.triggered && !button.clicked) {
        // quando o usuario recebeu um alarme
        setClickedClass("bg-red-800");
      } else if (button.triggered && button.clicked) {
        // quando o usuario disparou um combo
        setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      } else {
        // quando alguem desativou o alarme do usuario
        setClickedClass("");
      }
    } else {
      setInitiatedByUser(false);
    }
  }, [button.triggered]);

  const handleClickAlarm = () => {
    handleClick?.();
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
      } else if (isClicked && !button.triggered) {
        setClickedButton(button.id);
        setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      } else {
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
  return (
    <div
      className={`${commonClasses} flex flex-col justify-between cursor-pointer bg-green-700 ${clickedClass}`}
      onClick={handleClickAlarm}
    >
      <div className="flex items-center gap-1 cursor-pointer ">
        <OctagonAlert size={17} color="white" />
        <p
          className={`font-medium leading-none text-[9px] xl3:text-sm xl4:text-md ${buttonClass}`}
        >
          {button.button_name}
        </p>
      </div>
      <div className="flex font-extrabold text-xl justify-end  xl3:text-3xl xl4:text-4xl">
        {button.button_prt}
      </div>
    </div>
  );
}
