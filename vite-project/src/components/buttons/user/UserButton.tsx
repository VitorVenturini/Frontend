import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { User } from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";
import { useUsers } from "@/components/users/usersCore/UserContext";
import { commonClasses } from "../ButtonsComponent";
import { useUsersPbx } from "@/components/users/usersPbx/UsersPbxContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { getText } from "@/components/utils/utilityFunctions";

interface ButtonProps {
  button: ButtonInterface;
  handleClick: () => void;
}

export default function UserButton({ button, handleClick }: ButtonProps) {
  const { usersPbx } = useUsersPbx();
  const { language } = useLanguage();
  const { setStopCombo } = useButtons();

  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === button.button_prt;
  })[0];

  const [statusClass, setStatusClass] = useState("");
  const [callStatusClass, setCallStatusClass] = useState("");
  const [clickedButton, setClickedButton] = useState(false);
  const account = useAccount();
  const wss = useWebSocketData();

  // combo ligação
  useEffect(() => {
    if (button.comboStart) {
      if (!account.isAdmin) {
        if (!clickedButton && filteredUser.status !== "offline") {
          // ligar
          wss?.sendMessage({
            api: "user",
            mt: "TriggerCall",
            btn_id: button.id,
          });
          setClickedButton(true);
          setStopCombo(button.id);
        }
      }
    }
  }, [button.comboStart]);

  const handleClickCall = () => {
    handleClick(); // para setar a posição na hora de criar botão
    if (!account.isAdmin) {
      if (!clickedButton && filteredUser.status !== "offline") {
        // ligar
        wss?.sendMessage({
          api: "user",
          mt: "TriggerCall",
          btn_id: button.id,
        });
        //setStatusClass("bg-red-800");
        setClickedButton(true);
      } else if (clickedButton && filteredUser.status !== "offline") {
        // desligar
        wss?.sendMessage({
          api: "user",
          mt: "EndCall",
          btn_id: button.id,
        });
        //setStatusClass("bg-green-800");
        setClickedButton(false);
        setStopCombo(button.id);
      }
    }
  };
  //CORES PARA PARTE DE BAIXO DO BOTÃO (LISTRINHA)
  useEffect(() => {
    switch (filteredUser?.status) {
      case "online":
        setStatusClass("bg-green-600");
        break;
      case "on-the-phone":
        setStatusClass("bg-red-600");
        break;
      case "away":
        setStatusClass("bg-orange-500");
        break;
      case "busy":
        setStatusClass("bg-red-600");
        break;
      case "dnd":
        setStatusClass("bg-purple-600");
        break;
      case "offline":
        setStatusClass("bg-neutral-900");
        break;
      // default: // default sempre offline
      //   setStatusClass("bg-neutral-900");
    }
  }, [usersPbx]); // monitorar as alterações no contexto de usuario

  //CORES PARA O BOTÃO INTEIRO
  useEffect(() => {
    setCallStatusClass("bg-red-900");
    switch (button.clickedStatus) {
      case "callConnected":
        setCallStatusClass("bg-red-900");
        break;
      case "callInCurse":
        setClickedButton(true);
        setCallStatusClass("bg-red-900");
        break;
      case "callRinging":
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-orange-700");
        break;
      case "callDisconnected":
        setClickedButton(false);
        break;
      case "userCallHeld":
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-blue-800");
        break;
      case "userCallRetrieved":
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-red-900");
        break;
      case "callRetrieved":
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-red-900");
        break;
      case "callHeld":
        //setStatusClass("bg-orange-500")
        setCallStatusClass("bg-purple-900");
        break;
    }
  }, [button.clickedStatus]); // monitorar o status da chamada

  return (
    <div
      className={`${commonClasses} flex flex-col justify-between h-full cursor-pointer ${
        clickedButton
          ? callStatusClass
          : filteredUser?.status === "offline"
          ? "bg-neutral-900"
          : "bg-green-800"
      } `}
      onClick={handleClickCall}
    >
      <div className="flex-grow">
        <div className="flex items-center gap-1 cursor-pointer">
          <User size={16} />
          <p className="text-sm leading-none xl3:text-2xl">
            {button.button_name}
          </p>
        </div>
        <div className="text-sm flex font-extrabold justify-end">
          <p className="xl3:text-2xl">{filteredUser?.cn}</p>
        </div>
      </div>
      <div
        className={`text-sm text-foreground/55 flex justify-center mt-auto w-full ${statusClass}`}
      >
        {getText(filteredUser?.note, texts[language])}
      </div>
    </div>
  );
}
