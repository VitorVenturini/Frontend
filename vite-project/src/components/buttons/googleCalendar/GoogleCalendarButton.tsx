import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import * as Icons from "lucide-react";
import React, { useEffect, useState } from "react";
import { commonClasses } from "../ButtonsComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { getText } from "@/components/utils/utilityFunctions";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { useUsersPbx } from "@/components/users/usersPbx/UsersPbxContext";

interface NumberProps {
  button: ButtonInterface;
  onClick?: () => void;
}

export default function GoogleCalendarButton({ button, onClick }: NumberProps) {
  let IconComponent: React.ElementType | null = null;
  if (button.img && Icons[button.img as keyof typeof Icons]) {
    IconComponent = Icons[button.img as keyof typeof Icons] as React.ElementType;
  }

  const { usersPbx } = useUsersPbx();

  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === button.button_prt;
  })[0];

  const account = useAccount();
  const { language } = useLanguage();
  const wss = useWebSocketData();
  const { setStopCombo, 
    setClickedButton, 
    removeClickedButton
  } = useButtons();
  const [callStatusClass, setCallStatusClass] = useState(
    button.colorClass || ""
  );
  const [clickedStatusClass, setClickedStatusClass] = useState(
    button.colorClass || ""
  );

  // Atualiza a classe de status ao alterar o clickedStatus
  useEffect(() => {
    switch (button.clickedStatus) {
      case "callConnected":
        setClickedStatusClass("bg-red-800");
        break;
      case "incomingCallConnected":
      case "callInCurse":
        setClickedButton(button.id);
        setClickedStatusClass("bg-red-900");
        break;
      case "callRinging":
        setClickedStatusClass("bg-orange-700");
        break;
      case "callDisconnected":
        removeClickedButton(button.id);
        setClickedStatusClass("bg-green-800");
        break;
      case "userCallHeld":
        setClickedStatusClass("!bg-blue-800");
        break;
      case "userCallRetrieved":
      case "callRetrieved":
        setClickedStatusClass("bg-red-900");
        break;
      case "callHeld":
        setClickedStatusClass("bg-purple-900");
        break;
    }
  }, [button.clickedStatus]);

  // Atualiza a classe de status ao alterar o callStatus
  // useEffect(() => {
  //   switch (button.callStatus) {
  //     case "online":
  //       setLocalCallStatusClass("bg-green-600");
  //       break;
  //     case "busy":
  //       setLocalCallStatusClass("bg-red-600");
  //       break;
  //     case "ringing":
  //       setLocalCallStatusClass("bg-orange-500");
  //       break;
  //     case "offline":
  //       setLocalCallStatusClass("bg-neutral-600");
  //       break;
  //     default:
  //       setLocalCallStatusClass("bg-neutral-600");
  //       break;
  //   }
  // }, [button.callStatus]);

  //Chamado para atualizar a cor do note
  useEffect(() => {
    switch (button.button_prt) {
      case "":
        setCallStatusClass("bg-neutral-600");
        break;
      default:
        setCallStatusClass("bg-green-600");
        break;
    }
  }, [button.button_prt]);

  console.log("button updated:", button);

  const handleClick = () => {
    onClick?.();
    if (!account.isAdmin) {
      if (button.button_prt && button.button_prt != "") {
        if (!button.clicked) {
          wss?.sendMessage({
            api: "user",
            mt: "TriggerGoogleCalendarCall",
            btn_id: button.id,
          });
          setClickedButton(button.id);
          setClickedStatusClass("bg-red-800");
        } else {
          wss?.sendMessage({
            api: "user",
            mt: "EndCall",
            btn_id: button.id,
          });
          removeClickedButton(button.id);
          setClickedStatusClass("bg-green-800");
          setStopCombo(button.id);
        }
      }
    }
  };

  const buttonClass =
    button.button_name.length < 10
      ? "text-md xl3:text-xl xl4:text-3xl"
      : "text-[9px] xl3:text-sm xl4:text-md";

  const buttonPrtClass = button.button_prt ? "bg-green-800" : "bg-neutral-900";

  return (
    <div
      key={button.id + button.button_prt} // Força o re-render
      className={`${commonClasses} flex flex-col cursor-pointer ${
        button.clicked ? clickedStatusClass : buttonPrtClass
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        {IconComponent && <IconComponent size={17} />}
        <p className={`leading-none ${buttonClass}`}>{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-end font-extrabold">
        <p className="xl3:text-2xl">{filteredUser?.cn}</p>
      </div>
      <div
        className={`text-[10px] xl2:text-sm flex justify-center text-white/55 mt-auto w-full ${
          callStatusClass
        }`}
      >
        {button.button_prt ? texts[language].online : texts[language].offline}
      </div>
    </div>
  );
}
