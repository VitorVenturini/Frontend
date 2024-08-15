import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import * as Icons from "lucide-react";
import React, { useEffect, useState } from "react";
import { commonClasses } from "../ButtonsComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
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
  const [statusClass, setStatusClass] = useState("bg-green-800");
  const wss = useWebSocketData();
  const [clickedButton, setClickedButton] = useState(false);
  const handleClick = () => {
    onClick(); // para setar a posição na hora de criar botão
    if (!account.isAdmin) {
      if (!clickedButton) { // ligar
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCall",
          btn_id: button.id,
        });
        setStatusClass("bg-red-800");
        setClickedButton(true)
      }else{ // desligar
        wss?.sendMessage({
          api: "user",
          mt: "EndCall",
          btn_id: button.id,
        });
        setStatusClass("bg-green-800");
        setClickedButton(false)
      }
    }
    //console.log("Button" + JSON.stringify(button))
   

  };

  useEffect(() => {
    // setStatusClass("bg-red-900");
    switch (button.callStatus) {
      case "callConnected":
        setStatusClass("bg-red-600");
        break;
      case "callRinging":
        setStatusClass("bg-orange-500");
        break;
      case "callDisconnected":
        setStatusClass("bg-green-800")
        setClickedButton(false)
        break;
    }
  }, [button.callStatus]); // monitorar o status da chamada 

  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer ${statusClass}  `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        {IconComponent && <IconComponent />}
        <p className="text-sm leading-none">{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-center">
        <p>{button.button_prt}</p>
      </div>
    </div>
  );
}
