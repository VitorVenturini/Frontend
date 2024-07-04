import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface } from "../user/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useState } from "react";

interface ChatProps {
  userToChat: UserInterface;
}

export default function ChatLayout({ userToChat }: ChatProps) {
  const wss = useWebSocketData();
  const [message, setMessage] = useState("");
  const handleSendMsg = () => {
    wss?.sendMessage({
      api: "user",
      mt: "Message",
      to: userToChat.guid,
      msg: message
    });
  };
  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  // chat_id: 'emergencys',
  // from_guid: conn.guid,
  // to_guid: obj.to,
  // date: String(getDateNow()),
  // msg:obj.msg
  return (
    <div>
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
