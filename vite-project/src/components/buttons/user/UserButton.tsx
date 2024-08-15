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

interface ButtonProps {
  button: ButtonInterface;
  handleClick: () => void;
}

export default function UserButton({ button, handleClick }: ButtonProps) {
  const { usersPbx } = useUsersPbx();
  const { language } = useLanguage();

  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === button.button_prt;
  })[0];

  const [statusClass, setStatusClass] = useState("");
  const [callStatusClass, setCallStatusClass] = useState("");
  const [clickedButton, setClickedButton] = useState(false);
  const account = useAccount();
  const wss = useWebSocketData();

  //função para o typeScript parar de encher o saco
  const getText = (
    key: string | undefined,
    languageTexts: (typeof texts)[typeof language]
  ): string => {
    if (key && key in languageTexts) {
      return languageTexts[key as keyof typeof languageTexts];
    }
    return key || ""; // ou outra mensagem padrão
  };

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
      }
    }
  };
  useEffect(() => {
    switch (filteredUser?.status) {
      case "online":
        setStatusClass("bg-green-900");
        break;
      case "on-the-phone":
        setStatusClass("bg-red-600");
        break;
      case "ringing":
        setStatusClass("bg-orange-500");
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
      default: // default sempre offline
        setStatusClass("bg-neutral-900");
    }
  }, [usersPbx]); // monitorar as alterações no contexto de usuario

  useEffect(() => {
    setCallStatusClass("bg-red-900");
    switch (button.callStatus) {
      case "callConnected":
        setCallStatusClass("bg-red-600");
        break;
      case "callRinging":
        setStatusClass("bg-orange-500")
        setCallStatusClass("bg-orange-500");
        break;
      case "callDisconnected":
        setClickedButton(false)
        break;
    }
  }, [button.callStatus]); // monitorar o status da chamada 

  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer ${
        clickedButton ? callStatusClass : statusClass
      } `}
      onClick={handleClickCall}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <User />
        <p className="text-sm leading-none">{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-center">
        <p>{filteredUser?.cn}</p>
      </div>
      <div className="text-sm flex justify-center">
        {getText(filteredUser?.note, texts[language])}
      </div>
    </div>
  );
}
