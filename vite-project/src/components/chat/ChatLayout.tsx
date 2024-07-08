import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface } from "../user/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import { ChatInterface, useChat } from "./ChatContext";

interface ChatProps {
  userToChat: UserInterface;
}

export default function ChatLayout({ userToChat }: ChatProps) {
  const wss = useWebSocketData();
  const [message, setMessage] = useState("");
  const { chat,addChat } = useChat();

  useEffect(() => {
    if (wss) {
      wss.sendMessage({
        api: "user",
        mt: "SelectMessageHistorySrc",
        to: userToChat.guid,
      });
    }
  }, [userToChat.guid]);

  useEffect(() => {
    console.log("Chat atualizado:", chat);
  }, [chat]);

  const handleSendMsg = () => {
    wss?.sendMessage({
      api: "user",
      mt: "Message",
      to: userToChat.guid,
      msg: message,
    });
    setMessage("");
  };
  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  console.log("TODAS MENSAGENS" + JSON.stringify(chat))
  return (
    <div>
       {chat.map((message) => (
        <div key={message.id}>{message.msg}</div>
      ))}

      <div className="mt-5">Chat com {userToChat.name}</div>

      <div className="flex items-center gap-3 p-2">
        <Input
          placeholder="escreva algo aqui"
          value={message}
          onChange={handleInputMessage}
        />
        <Button size="icon" onClick={handleSendMsg}>
          <Send />
        </Button>
      </div>
    </div>
  );
}
