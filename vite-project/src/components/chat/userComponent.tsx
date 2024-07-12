import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserInterface } from "../user/UserContext";
import { useChat } from "./ChatContext";
import { useState, useEffect } from "react";

interface OptProps {
  user: UserInterface;
  onClick: () => void;
  clickedUser: string | null; // para verificar se está aberto o chat 
}

export default function UserComponent({ user, onClick, clickedUser }: OptProps) {
  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-center justify-center";

  const handleClick = () => {
    onClick();
    setIsClicked(true);
  };
  // const { chat, addChat } = useChat();
  // const [newMessageReceived, setNewMessageReceived] = useState(false);
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // useEffect(() => {
  //   const lastMessage = chat[chat.length - 1];
  //   if (
  //     lastMessage &&
  //     lastMessage.to_guid === myAccountInfo.guid &&
  //     lastMessage.from_guid === user.guid &&
  //     lastMessage.read === null &&
  //     clickedUser !== user.guid
  //   ) {
  //     setNewMessageReceived(true); // marca que uma nova mensagem foi recebida
  //   }
  // }, [addChat]);

  // useEffect(() => {
  //   if (clickedUser === user.guid) {
  //     setNewMessageReceived(false); // marca como lida quando o chat é aberto
  //   }
  // }, [addChat]);

  // ajustar chat 
  return (
    <div>
      <div
        className={`${commonClasses} flex flex-col cursor-pointer`}
        onClick={handleClick}
      >
        {/* {newMessageReceived  && clickedUser !== user.guid ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        ) : null} */}
        <div className="flex items-center gap-1 cursor-pointer">
          <p className="text-sm font-medium leading-none">{user.name}</p>
        </div>
        <div className="flex items-center"></div>
      </div>
    </div>
  );
}
