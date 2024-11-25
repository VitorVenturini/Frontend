import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { CircleDot, OctagonAlert } from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";
import { commonClasses } from "../ButtonsComponent";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { getText } from "@/components/utils/utilityFunctions";
interface ButtonProps {
  button: ButtonInterface;
  handleClick?: () => void;
}

export default function FlicButton({ button, handleClick }: ButtonProps) {
  const [clickedClass, setClickedClass] = useState("");
  const { setClickedButton, removeClickedButton } = useButtons();
  const { language } = useLanguage();
  const account = useAccount();
  const wss = useWebSocketData();
  const [initiatedByUser, setInitiatedByUser] = useState(false);

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

  const handleClickFlic = () => {
    handleClick?.();
    setInitiatedByUser(true);
    if (!account.isAdmin) {
      const isTriggered = button.triggered;
      if (isTriggered) {
        removeClickedButton(button.id);
        setClickedClass("");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerStopAlarm",
          prt: button.button_prt,
          btn_id: button.id,
        });
      }
    }
  };
  return (
    <div
      className={`${commonClasses} flex flex-col justify-between cursor-pointer bg-purple-700 ${clickedClass}`}
      onClick={handleClickFlic}
    >
      <div className="flex items-center gap-1 cursor-pointer ">
        <CircleDot size={17} color="white" />
        <p className=" font-medium leading-none text-[9px] xl3:text-sm xl4:text-md">
          {button.button_name}
        </p>
      </div>
      <div className="flex font-extrabold text-md justify-end  xl3:text-lg xl4:text-lg">
        {getText(button.button_prt.toLowerCase(), texts[language])}
      </div>
    </div>
  );
}
