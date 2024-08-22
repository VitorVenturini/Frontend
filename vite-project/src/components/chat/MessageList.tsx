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
import OptChat from "../optBar/OptChat";
import { useAccount } from "../account/AccountContext";

interface OptProps {
  user: UserInterface;
  onClick: () => void;
  clickedUser: string | null;
}

export default function MessageList({ user, onClick, clickedUser }: OptProps) {
  const [lastestMessage, setLastestMessage] = useState<ChatInterface[]>();
  const { chat } = useChat();
  const account = useAccount()
  const myAccountInfo = JSON.parse(localStorage.getItem(account.session) || "{}");
  const userToChat = user.guid === clickedUser ? user : null;

  useEffect(() => {
    // Filtra as mensagens relacionadas ao usuário atual e ao usuário passado como prop
    const userMessages = chat.filter(
      (message) =>
        (message.to_guid === myAccountInfo.guid &&
          message.from_guid === user.guid) ||
        (message.from_guid === myAccountInfo.guid &&
          message.to_guid === user.guid)
    );

    // ordena as mensagens por data
    const sortedMessages = userMessages.sort(
      (a, b) =>
        new Date(a.date || "").getTime() - new Date(b.date || "").getTime()
    );

    setLastestMessage(sortedMessages);
  }, [chat]);

  const initials = getInitials(user.name || "Usuário");
  const avatarBase64 = generateAvatar(initials);

  return (
    <div>
      <div onClick={onClick}>
        <ChatList
          id={user.id}
          className="chat-list text-black"
          lazyLoadingImage=""
          dataSource={[
            {
              id: user.id as number,
              //statusColor: "#EF4444",
              avatar: avatarBase64,
              alt: "",
              title: user.name || "Usuário sem nome",
              subtitle: lastestMessage
                ? lastestMessage[lastestMessage.length - 1]?.msg
                : "",
                avatarSize: "large",
              date: lastestMessage ? lastestMessage[lastestMessage.length - 1]?.date as Date : undefined,
              statusColor: user?.status === "online" ? "#16A34A" : "#DB2424",
              // date: lastestMessage
              //   ? new Date(
              //       lastestMessage[lastestMessage.length - 1]?.date || ""
              //     )
              //   : undefined,
              unread: lastestMessage
                ? lastestMessage.filter(
                    (message) =>
                      message.read === null && message.from_guid === user.guid
                  ).length
                : undefined,
            },
          ]}
          
        />
      </div>
      <OptChat userToChat={userToChat as UserInterface} onClick={onClick} />
    </div>
  );
}
