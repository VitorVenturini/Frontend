import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import * as Icons from "lucide-react";
import React, { useEffect } from "react";
import { commonClasses } from "../ButtonsComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { getText } from "@/components/utils/utilityFunctions";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface NumberProps {
  button: ButtonInterface;
  onClick?: () => void;
}

export default function GoogleCalendarButton({ button, onClick }: NumberProps) {
  let IconComponent: React.ElementType | null = null;
  if (button.img && Icons[button.img as keyof typeof Icons]) {
    IconComponent = Icons[button.img as keyof typeof Icons] as React.ElementType;
  }

  const account = useAccount();
  const { language } = useLanguage();
  const wss = useWebSocketData();
  const { setStopCombo, setClickedButton, removeClickedButton } = useButtons();

  // Log para debuggar a atualização do botão
  useEffect(() => {
    console.log("button updated:", button);
  }, [button]);

  const buttonClass =
    button.button_name.length < 10
      ? "text-md xl3:text-xl xl4:text-3xl"
      : "text-[9px] xl3:text-sm xl4:text-md";

  const callStatusClass = (() => {
    switch (button.callStatus) {
      case "online":
        return "bg-green-600";
      case "busy":
        return "bg-red-600";
      case "ringing":
        return "bg-orange-500";
      case "vacant":
        return "bg-grey-600";
      default:
        return "bg-neutral-600";
    }
  })();

  const clickedStatusClass = (() => {
    switch (button.clickedStatus) {
      case "callConnected":
        return "bg-red-600";
      case "incomingCallConnected":
      case "callInCurse":
        setClickedButton(button.id);
        return "bg-red-900";
      case "callRinging":
        return "bg-orange-700";
      case "callDisconnected":
        removeClickedButton(button.id);
        return "bg-green-800";
      case "userCallHeld":
        return "!bg-blue-800";
      case "userCallRetrieved":
      case "callRetrieved":
        return "bg-red-900";
      case "callHeld":
        return "bg-purple-900";
      default:
        return "bg-neutral-800";
    }
  })();

  const noteStatusClass = (() => {
    switch (button.note) {
      case "offline":
      case "vacant":
        return "bg-neutral-900";
      default:
        return "";
    }
  })();

  const handleClick = () => {
    onClick?.();
    if (!account.isAdmin) {
      if (button.note !== "offline" && button.note !== "vacant") {
        if (!button.clicked) {
          wss?.sendMessage({
            api: "user",
            mt: "TriggerCall",
            btn_id: button.id,
          });
          setClickedButton(button.id);
        } else {
          wss?.sendMessage({
            api: "user",
            mt: "EndCall",
            btn_id: button.id,
          });
          setClickedButton(button.id);
          setStopCombo(button.id);
        }
      }
    }
  };

  return (
    <div
      key={button.id + button.button_prt} // Força o re-render
      className={`${commonClasses} flex flex-col cursor-pointer ${
        button.clicked ? clickedStatusClass : "bg-green-800"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        {IconComponent && <IconComponent size={17} />}
        <p className={`leading-none ${buttonClass}`}>{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-end font-extrabold">
        <p className="xl3:text-2xl">{button.button_prt}</p>
      </div>
      <div
        className={`text-[10px] xl2:text-sm flex justify-center text-white/55 mt-auto w-full ${
          noteStatusClass || callStatusClass
        }`}
      >
        {button.note ? getText(button?.note, texts[language]) : "Disponível"}
      </div>
    </div>
  );
}
