import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface, useUsers } from "../user/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import { ChatInterface, useChat } from "./ChatContext";
import React from "react";
import { MessageList, MessageType } from "react-chat-elements";
import "react-chat-elements/dist/main.css"; // CSS da biblioteca de chat
import { useRef } from "react";

interface ChatProps {
  userToChat: UserInterface;
}

export default function ChatLayout({ userToChat }: ChatProps) {
  const wss = useWebSocketData();
  const [message, setMessage] = useState("");
  const { chat, addChat } = useChat();
  const { users } = useUsers();

  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
  const messageListRef = useRef<any>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null); 
  // estudar sobre  o useRef ~ pietro

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
    setMessage("");
  };

  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  console.log("RENDERIZOU O CHATLAYOUT.tsx");
  return (
    <div>
      <div className="h-[400px] overflow-y-auto">
        <MessageList
          className="message-list text-black"
          lockable={true}
          toBottomHeight={"100%"}
          dataSource={chat.map((message) => {
            console.log("Mensagem:", message); // Adicione este log
            const isMyMessage = message.from_guid === myAccountInfo.guid;
            const messageText = message.msg || "";
            //console.log("Mensagem renderizada:", messageText);
            return {
              position: isMyMessage ? "right" : "left",
              type: "text",
              title: isMyMessage ? myAccountInfo.name : userToChat.name,
              text: messageText,
            } as MessageType;
          })}
          referance={messageListRef}
        />
           <div ref={endOfMessagesRef} />

      </div>

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
