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
  const buttonClass =
    button.button_name.length < 10
      ? "text-md xl3:text-xl xl4:text-3xl"
      : "text-[9px] xl3:text-sm xl4:text-md";

  const handleClickOutside = (event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
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
      className={`${commonClasses} ${
        isFocused ? "bg-cyan-900" : "bg-cyan-600"
      } flex flex-col cursor-pointer`}
      onClick={handleClickCombo}
    >
      <div className="flex items-center gap-1 cursor-pointer align-middle justify-center h-full ">
        <p className={`leading-none ${buttonClass}`}>{button.button_name}</p>
      </div>
    </div>
  );
}
