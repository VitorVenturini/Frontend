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
import { ChatInterface, useChat } from "./ChatContext";
import { useState, useEffect } from "react";
import { ChatList } from "react-chat-elements";
import { User } from "lucide-react";
import { getInitials, generateAvatar } from "../utils/utilityFunctions";
interface OptProps {
  user: UserInterface;
  onClick: () => void;
  // clickedUser: string | null; // para verificar se está aberto o chat
  // selectedOpt: string;
}

export default function MessageList({
  user,
  onClick,
  // clickedUser,
  // selectedOpt,
}: OptProps) {
  const commonClasses =
    "w-[60px] h-[40px]  xl:w-[60px] xl:h-[60px] 2xl:w-[80px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-center justify-center";

  const [lastestMessage, setLastestMessage] = useState<ChatInterface[]>();
  const handleClick = () => {
    onClick();
    setIsClicked(true);
  };
  const { chat, addChat } = useChat();
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    // Filtra as mensagens recebidas do usuário atual
    const userMessages = chat.filter(
      (message) =>
        message.to_guid === myAccountInfo.guid && // condição para quando a mensagem for para mim
        message.from_guid === user.guid
      // && message.read === null
    );
    setLastestMessage(userMessages);
    // // Verifica se há mensagens não lidas
    // if (unreadMessages.length > 0) {
    //   if (clickedUser !== user.guid) {
    //     setNewMessageReceived(true); // Marca que há novas mensagens recebidas
    //   } else {
    //     setNewMessageReceived(false); // Se o chat do usuário estiver aberto, marca como lida
    //   }
    // } else {
    //   setNewMessageReceived(false); // Se não houver mensagens não lidas, desmarca
    // }
  }, [chat]);

  const initials = getInitials(user.name || "Usuário");
  const avatarBase64 = generateAvatar(initials);

  return (
    <div onClick={onClick} >
      <ChatList
        id={user.id}
        className="chat-list text-black"
        lazyLoadingImage=""  // Adicione isso se necessário para evitar erros, pode ser um caminho para uma imagem de carregamento
        dataSource={[
          {
            id: user.id as number,
            avatar: avatarBase64,
            alt: "",
            title: user.name || "Usuário sem nome",
            //const lastMessage = lastestMessage ? lastestMessage[lastestMessage.length - 1]?.msg : "";
            subtitle: lastestMessage ? lastestMessage[lastestMessage.length - 1]?.msg : "",
            date: lastestMessage ? new Date(lastestMessage[lastestMessage.length - 1]?.date || '') : undefined,
            unread: lastestMessage && lastestMessage[lastestMessage.length - 1]?.read === null ? lastestMessage.length : undefined,
          },
        ]}
      />
    </div>
  );
}
