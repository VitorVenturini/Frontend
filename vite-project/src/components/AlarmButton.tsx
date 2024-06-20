import { ButtonInterface } from "./ButtonsContext";
import { OctagonAlert } from "lucide-react";
import { useButtons } from "./ButtonsContext";
import SensorResponsiveInfo from "./SensorResponsiveInfo";
import { useSensors } from "./SensorContext";
import { useEffect, useState } from "react";
import { useWebSocketData } from "./WebSocketProvider";

interface ButtonProps {
  button: ButtonInterface;
}

export default function AlarmButton({ button }: ButtonProps) {
  const [clickedClass, setClickedClass] = useState("");
  const { buttons, setClickedButton, removeClickedButton } = useButtons();
  const wss = useWebSocketData();
  const commonClasses =
    "w-[128px] h-[55px] rounded-lg border bg-border text-white shadow-sm p-1";

  useEffect(() => {
    // Verifica o estado inicial do botão e define a classe de acordo
    if (button.clicked) {
      setClickedClass("bg-red-800");
    } else {
      setClickedClass("");
    }
  }, [button]);

  const handleClickAlarm = () => {
    const isClicked = button.clicked;
    if (isClicked) {
      removeClickedButton(button.id);
      setClickedClass("");
      //       emergency-pietro: send: {"api":"user","mt":"DecrementCount"}
      //    {"api":"user","mt":"TriggerStopAlarm","prt":"2022","btn_id":"9"}
    } else {
      setClickedButton(button.id);
      setClickedClass("bg-red-800");
      //{"api":"user","mt":"TriggerAlert","prt":"2022","btn_id":"9"} estrutura de envio
      wss?.sendMessage({
        api: "user",
        mt: "TriggerAlert",
        prt: button.button_prt,
        btn_id: button.id,
      });
    }
  };

  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer bg-buttonNumber ${clickedClass}`}
      onClick={handleClickAlarm}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <OctagonAlert />
        <p className="text-sm font-medium leading-none">{button.button_name}</p>
      </div>
      <div>
        <p>{button.button_prt}</p>
      </div>
    </div>
  );
}
