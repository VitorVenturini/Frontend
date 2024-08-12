import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { ButtonInterface, useButtons } from "../buttonContext/ButtonsContext";
import { Layers3 } from "lucide-react";
import { useAccount } from "@/components/account/AccountContext";
import { useEffect, useRef, useState } from "react";
import { commonClasses } from "../ButtonsComponent";
interface ComboProps {
  button: ButtonInterface;
  handleClick: () => void;
}

export default function ComboButton({ button, handleClick }: ComboProps) {
  const wss = useWebSocketData();
  const account = useAccount();

  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);



  const handleClickOutside = (event: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickCombo = () => {
    handleClick(); // ativar a prop
    setIsFocused(true);
    if (!account.isAdmin) {
      wss?.sendMessage({
        api: "user",
        mt: "TriggerCombo",
        btn_id: button?.id,
      });
    }
  };

  return (
    <div
      ref={buttonRef}
      className={`${commonClasses} ${isFocused ? "bg-cyan-900" : "bg-cyan-600"
        } flex flex-col cursor-pointer`}
      onClick={handleClickCombo}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <Layers3 />
        <p className="text-sm font-medium leading-none">{button.button_name}</p>
      </div>
      <div>{/* <p>{button.button_prt}</p> */}</div>
    </div>
  );
}