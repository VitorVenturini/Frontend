import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
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
  onClick: () => void;
}
export default function NumberButton({ button, onClick }: NumberProps) {
  let IconComponent: React.ElementType | null = null;
  if (button.img && Icons[button.img as keyof typeof Icons]) {
    IconComponent = Icons[
      button.img as keyof typeof Icons
    ] as React.ElementType;
  }
  const account = useAccount();
  const [callStatusClass, setCallStatusClass] = useState("");
  const [clickedStatusClass, setClickedStatusClass] = useState("");
  const { language } = useLanguage();
  const wss = useWebSocketData();
  const [clickedButton, setClickedButton] = useState(false);
  const {setStopCombo} = useButtons()

  //combo ligação
  useEffect(() => {
    if (button.comboStart) {
      if (!account.isAdmin) {
        if (!clickedButton) {
          // ligar
          wss?.sendMessage({
            api: "user",
            mt: "TriggerCall",
            btn_id: button.id,
          });
          setClickedButton(true);
          setClickedStatusClass("bg-red-800");
          setStopCombo(button.id)
        }
      }
    }
  }, [button.comboStart]);

  
  const handleClick = () => {
    onClick(); // para setar a posição na hora de criar botão
    if (!account.isAdmin) {
      if (!clickedButton) {
        // ligar
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCall",
          btn_id: button.id,
        });
        setClickedStatusClass("bg-red-800");
        setClickedButton(true);
      } else {
        // desligar
        wss?.sendMessage({
          api: "user",
          mt: "EndCall",
          btn_id: button.id,
        });
        setClickedStatusClass("bg-green-800");
        setClickedButton(false)
        setStopCombo(button.id)
      }
    }
    //console.log("Button" + JSON.stringify(button))
  };

  // CORES PARA TODO BOTÃO 

  useEffect(() => {
    // setStatusClass("bg-red-900");
    switch (button.clickedStatus) {
      case "callConnected":
        setClickedStatusClass("bg-red-900");
        break;
      case "callRinging":
        setClickedStatusClass("bg-orange-700");
        break;
      case "callDisconnected":
        setClickedStatusClass("bg-green-800");
        setClickedButton(false);
        break;
    }
  }, [button.clickedStatus]); // monitorar o status de click

  // CORES PARA PARTE DE BAIXO DO BOTÃO (LISTRINHA)
  useEffect(() => {
    // setStatusClass("bg-red-900");
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
        clickedButton ? clickedStatusClass : "bg-green-800"
      }  `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        {IconComponent && <IconComponent />}
        <p className="text-sm leading-none">{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-center">
        <p>{button.button_prt}</p>
      </div>
      <div
        className={`text-sm flex justify-center mt-auto w-full ${button.callStatus ? callStatusClass : "bg-green-600"}`}
      >
        { button.note ? getText(button?.note, texts[language]) : "Disponível"}
      </div>
    </div>
  );
}
