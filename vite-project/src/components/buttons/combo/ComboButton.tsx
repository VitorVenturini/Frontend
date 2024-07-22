import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { ButtonInterface, useButtons } from "../buttonContext/ButtonsContext";
import { Layers3 } from "lucide-react";
import { useAccount } from "@/components/account/AccountContext";
import { useState } from "react";

interface ComboProps {
  button: ButtonInterface;
  handleClick: () => void;
}
export default function ComboButton({ button, handleClick }: ComboProps) {
  const wss = useWebSocketData();
  const account = useAccount();
  const { buttons, setClickedButton, removeClickedButton } =
    useButtons();
  const [clickedClass, setClickedClass] = useState("");
  const commonClasses =
    "w-[128px] h-[60px] md:w-[128px] md:h-[60px]  lg:w-[128px] lg:h-[60px]  xl:w-[128px] xl:h-[60px] 2xl:w-[150px] 2xl:h-[80px] rounded-lg border bg-border text-white shadow-sm p-1";

  const handeClickCombo = () => {
    handleClick(); // ativar a prop
    if (!account.isAdmin) {
      const isClicked = button.clicked;
      if (isClicked) {
        setClickedClass("")
        removeClickedButton(button.id)
        //stop combo futuramente ????????????????????
      } else {
        setClickedButton(button.id)
        setClickedClass("bg-red-800");
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCombo",
          btn_id: button?.id,
        });
      }

    }
  };
  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer bg-buttonCombo ${clickedClass}`}
      onClick={handeClickCombo}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <Layers3 />
        <p className="text-sm font-medium leading-none">{button.button_name}</p>
      </div>
      <div>{/* <p>{button.button_prt}</p> */}</div>
    </div>
  );
}
