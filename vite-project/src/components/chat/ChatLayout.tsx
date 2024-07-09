import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface, useUsers } from "../user/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import { ChatInterface, useChat } from "./ChatContext";
import React from "react";
import { MessageList, MessageType, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css"; // CSS da biblioteca de chat
import { useRef } from "react";
import { format } from "date-fns";

interface ChatProps {
  userToChat: UserInterface;
}

export default function ChatLayout({ userToChat }: ChatProps) {
  const wss = useWebSocketData();
  const [message, setMessage] = useState("");
  const { chat, addChat, chatDelivered } = useChat();
  const { users } = useUsers();

  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
  const messageListRef = useRef<any>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  // estudar sobre  o useRef ~ pietro

  useEffect(() => {
    if (wss) {
      wss.sendMessage({
        api: "user",
        mt: "SelectMessageHistorySrc",
        to: userToChat.guid,
      });
    }
  }, [userToChat.guid]); // sempre que abrir a página de chat

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
  }, [chat]); // scrollar para baixo apos cada mensagem

  useEffect(() => {
    const lastMessage = chat[chat.length - 1];

    if (lastMessage) {
      console.log('lastmessage' + JSON.stringify(lastMessage))
      if (lastMessage.to_guid === userToChat.guid && !lastMessage.delivered) {
        if (wss) {
          wss.sendMessage({
            api: "user",
            mt: "ChatDelivered",
            msg_id: lastMessage.id,
          });
        }
      } else if(userToChat && lastMessage.to_guid === myAccountInfo.guid && userToChat.guid === lastMessage.from_guid){
        if (wss) {
          wss.sendMessage({
            api: "user",
            mt: "ChatRead",
            msg_id: lastMessage.id,
          });
        }
      }
    }
  }, [addChat,chat]); 

   const filteredMessages = chat.filter(
    (message) =>
      (message.from_guid === myAccountInfo.guid && message.to_guid === userToChat.guid) ||
      (message.from_guid === userToChat.guid && message.to_guid === myAccountInfo.guid)
  );

  return (
    <div>
      <div className="h-[400px] overflow-y-auto">
        {filteredMessages.map((message, index) => {
          const isMyMessage = message.from_guid === myAccountInfo.guid;
          const messageText = message.msg || "";
          //const formattedDate = format(message.date as string, "HH:mm");
          return (
            <MessageBox
              key={index}
              id={message.id}
              position={isMyMessage ? "right" : "left"}
              type="text"
              title={isMyMessage ? myAccountInfo.name : userToChat.name}
              text={messageText}
              className="text-black"
              status={
                message.read ? "read" : (message.delivered ? "received" : "sent") || "sent"
              }
              focus={false}
              date={new Date(message.date as Date) || new Date()}
              dateString={
                format(new Date(message.date as any), "HH:mm") ||
                format(new Date(), "HH:mm")
              }
              titleColor={isMyMessage ? "blue" : "green"}
              forwarded={false}
              replyButton={false}
              removeButton={false}
              notch={false}
              retracted={false}
            />
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>
      {/* <div className="h-[400px] overflow-y-auto">
        <MessageList
          className="message-list text-black"
          lockable={true}
          toBottomHeight={"100%"}
          dataSource={chat.map((message) => {
            const isMyMessage = message.from_guid === myAccountInfo.guid;
            const messageText = message.msg || "";

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
        {/* <MessageBox
          position={"left"}
          type={"text"}
          title={"Message Box Title"}
          text="Here is a text type message box"
          className="text-black"
          status=""
        /> 
      </div> */}

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
