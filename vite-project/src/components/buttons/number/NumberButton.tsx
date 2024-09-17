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

interface NumberProps {
  button: ButtonInterface;
  onClick?: () => void;
}
export default function NumberButton({ button, onClick }: NumberProps) {
  let IconComponent: React.ElementType | null = null;
  if (button.img && Icons[button.img as keyof typeof Icons]) {
    IconComponent = Icons[
      button.img as keyof typeof Icons
    ] as React.ElementType;
  }
  const account = useAccount();
  const [callStatusClass, setCallStatusClass] = useState(
    button.colorClass || ""
  );
  const [clickedStatusClass, setClickedStatusClass] = useState(
    button.colorClass || ""
  );
  const { language } = useLanguage();
  const wss = useWebSocketData();
  const { setStopCombo, setClickedButton, removeClickedButton } = useButtons();

  //combo ligação
  useEffect(() => {
    if (button.comboStart) {
      if (!account.isAdmin) {
          // ligar
          wss?.sendMessage({
            api: "user",
            mt: "TriggerCall",
            btn_id: button.id,
          });
          setClickedButton(button.id);
          setClickedStatusClass("bg-red-900");
          setStopCombo(button.id);
      }
    }
  }, [button]);

  const handleClick = () => {
    onClick?.(); // para setar a posição na hora de criar botão
    if (!account.isAdmin) {
      if (!button.clicked) {
        // ligar
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCall",
          btn_id: button.id,
        });
        setClickedStatusClass("bg-red-800");
        setClickedButton(button.id);
      } else {
        // desligar
        wss?.sendMessage({
          api: "user",
          mt: "EndCall",
          btn_id: button.id,
        });
        setClickedStatusClass("bg-green-800");
        setClickedButton(button.id);
        setStopCombo(button.id);
      }
    }
    //console.log("Button" + JSON.stringify(button))
  };

  //CORES PARA O BOTÃO INTEIRO
  useEffect(() => {
    setCallStatusClass("bg-red-600");
    switch (button.clickedStatus) {
      case "callConnected":
        setClickedStatusClass("bg-red-600");
        break;
      case "incomingCallConnected":
        setCallStatusClass("bg-red-900");
        break;
      case "callInCurse":
        setClickedButton(button.id);
        setCallStatusClass("bg-red-900");
        break;
      case "callRinging":
        //setStatusClass("bg-orange-500")
        setClickedStatusClass("bg-orange-700");
        break;
      case "callDisconnected":
        setClickedStatusClass("bg-green-800");
        removeClickedButton(button.id);
        break;
      case "userCallHeld":
        //setStatusClass("bg-orange-500")
        setClickedStatusClass("!bg-blue-800");
        break;
      case "userCallRetrieved":
        //setStatusClass("bg-orange-500")
        setClickedStatusClass("bg-red-900");
        break;
      case "callRetrieved":
        //setStatusClass("bg-orange-500")
        setClickedStatusClass("bg-red-900");
        break;
      case "callHeld":
        //setStatusClass("bg-orange-500")
        setClickedStatusClass("bg-purple-900");
        break;
    }
  }, [button.clickedStatus]); // monitorar o status da chamada

  // CORES PARA PARTE DE BAIXO DO BOTÃO (LISTRINHA)
  useEffect(() => {
    switch (button.callStatus) {
      case "online":
        setCallStatusClass("bg-green-600");
        break;
      case "busy":
        setCallStatusClass("bg-red-600");
        break;
      case "ringing":
        setCallStatusClass("bg-orange-500");
        break;
    }
  }, [button.callStatus]); // monitorar o status da chamada

  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer ${
        button.clicked ? clickedStatusClass : "bg-green-800"
      }  `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 cursor-pointer ">
        {IconComponent && <IconComponent size={17} />}
        <p className="text-sm leading-none xl4:text-2xl">
          {button.button_name}
        </p>
      </div>
      <div className="text-sm flex justify-end font-extrabold">
        <p className="xl3:text-2xl">{button.button_prt}</p>
      </div>
      <div
        className={`text-[10px] xl2:text-sm flex justify-center text-foreground/75 mt-auto w-full ${
          button.callStatus ? callStatusClass : "bg-green-600"
        }`}
      >
        {button.note ? getText(button?.note, texts[language]) : "Disponível"}
      </div>
    </div>
  );
}
