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
  
  export default function ClockmButton({ button, handleClick }: ButtonProps) {
    const [clickedClass, setClickedClass] = useState("");
    const account = useAccount();
    const wss = useWebSocketData();
    const [initiatedByUser, setInitiatedByUser] = useState(false);

  
    const handleClickAlarm = () => {
      handleClick?.();
      setInitiatedByUser(true);
    };
    return (
      <div
        className={`${commonClasses} flex flex-col justify-center items-center ${clickedClass}`}
        onClick={handleClickAlarm}
      >
        <div className="flex items-center gap-1 ">
          {button.button_name}
          
        </div>
        <div className=" items-center gap-1 font-extrabold text-3xl font-mono h-full ">
        
          {button.button_prt}
        </div>
      </div>
    );
  }