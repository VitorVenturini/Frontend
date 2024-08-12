import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserInterface } from "../users/usersCore/UserContext";
import { useChat } from "./ChatContext";
import { useState, useEffect } from "react";

interface OptProps {
  user: UserInterface;
  onClick: () => void;
  clickedUser: string | null; // para verificar se está aberto o chat
  selectedOpt: string;
}

export default function UserComponent({
  user,
  onClick,
  clickedUser,
  selectedOpt,
}: OptProps) {
  const commonClasses =
    "w-[60px] h-[40px]  xl:w-[60px] xl:h-[60px] 2xl:w-[80px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-center justify-center";

  const [newMessageReceived, setNewMessageReceived] = useState<boolean>(false);
  const handleClick = () => {
    onClick();
    setIsClicked(true);
  };
  const { chat, addChat } = useChat();
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    // Filtra as mensagens recebidas do usuário atual
    const unreadMessages = chat.filter(
      (message) =>
        message.to_guid === myAccountInfo.guid &&
        message.from_guid === user.guid &&
        message.read === null
    );
  
    // Verifica se há mensagens não lidas
    if (unreadMessages.length > 0) {
      if (clickedUser !== user.guid) {
        setNewMessageReceived(true); // Marca que há novas mensagens recebidas
      } else {
        setNewMessageReceived(false); // Se o chat do usuário estiver aberto, marca como lida
      }
    } else {
      setNewMessageReceived(false); // Se não houver mensagens não lidas, desmarca
    }
  }, [chat]);

  return (
    <div>
      <div
        className={`${commonClasses} flex flex-col cursor-pointer`}
        onClick={handleClick}
      >
        {newMessageReceived ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        ) : null}
        <div className="flex items-center gap-1 cursor-pointer">
          <p className="text-sm font-medium leading-none">{user.name}</p>
        </div>
        <div className="flex items-center"></div>
      </div>
    </div>
  );
}
