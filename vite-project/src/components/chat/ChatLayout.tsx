import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface } from "../user/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import { useChat } from "./ChatContext";

interface ChatProps {
  userToChat: UserInterface;
}

export default function ChatLayout({ userToChat }: ChatProps) {
  const wss = useWebSocketData();
  const [message, setMessage] = useState("");
  const { chat } = useChat();

  useEffect(() => {
    if (wss) {
      wss.sendMessage({
        api: "user",
        mt: "SelectMessageHistorySrc",
        to: userToChat.guid,
      });
    }
  }, [userToChat.guid]);

  const handleSendMsg = () => {
    wss?.sendMessage({
      api: "user",
      mt: "Message",
      to: userToChat.guid,
      msg: message,
    });
  };
  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  console.log("TODAS MENSAGENS" + chat)
  // chat_id: 'emergencys',
  // from_guid: conn.guid,
  // to_guid: obj.to,
  // date: String(getDateNow()),
  // msg:obj.msg
  return (
    <div>
      {/* <div>{chat}</div> */}
      {chat.map((chat, i) => (
        <div key={i}>{chat.msg}</div>
      ))}
      <div>Chat com {userToChat.name} </div>

      <div className="flex items-center gap-3 p-2">
        <Input
          placeholder="escreva algo aqui"
          value={message}
          onChange={handleInputMessage}
        />
        <Button size="icon" onClick={handleSendMsg}>
          {" "}
          <Send />{" "}
        </Button>
      </div>
    </div>
  );
}
