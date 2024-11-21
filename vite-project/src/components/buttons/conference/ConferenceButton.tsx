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
  handleClick?: () => void;
}
export default function ConferenceButton({ button, handleClick }: NumberProps) {
  const { language } = useLanguage();
  const wss = useWebSocketData();

  const handleClickConf = () => {
    handleClick?.(); // para setar a posição na hora de criar botão
  };

  const [callStatusClass, setCallStatusClass] = useState(button?.colorClass || "");
  const {removeClickedButton} = useButtons()
  
  useEffect(() => {
    switch (button.clickedStatus) {
      case "callConnected":
        setCallStatusClass("bg-red-900");
        break;
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-orange-700");
        break;
      case "callDisconnected":
        removeClickedButton(button.id);
        setCallStatusClass("");
        break;
      case "userCallRetrieved":
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-red-900");
        break;

    }
  }, [button.onCall]); // monitorar o status da chamada

  return (
    <div
      className={`${commonClasses} ${callStatusClass} flex flex-col cursor-pointer text-card-foreground bg-green-800 `}
      onClick={handleClickConf}
    >
      <div className="flex items-center gap-1 cursor-pointer ">
        {<Icons.Group />}
        <p className="text-sm leading-none xl4:text-2xl">
          {button.button_name}
        </p>
      </div>
      <div className="text-sm flex justify-end font-extrabold">
        <p className="xl3:text-2xl">{button.button_prt}</p>
      </div>
      <div className="text-[10px] xl2:text-sm flex justify-center text-white/55 mt-auto w-full">
        {button.note ? getText(button?.note, texts[language]) : "Disponível"}
      </div>
    </div>
  );
}
