import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface, useUsers } from "../users/usersCore/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import { ChatInterface, useChat } from "./ChatContext";
import React from "react";
import { MessageList, MessageType, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css"; // CSS da biblioteca de chat
import { useRef } from "react";
import { format } from "date-fns";
import { toast } from "../ui/use-toast";
import { useAccount } from "../account/AccountContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import data, { Emoji, EmojiMartData } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
interface ChatProps {
  userToChat: UserInterface;
}

export default function ChatLayout({ userToChat }: ChatProps) {
  const wss = useWebSocketData();
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const { chat, addChat, chatRead } = useChat();
  const { users } = useUsers();
  const account = useAccount();
  const myAccountInfo = JSON.parse(
    localStorage.getItem(account.session) || "{}"
  );
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
    if (!message) {
      toast({
        variant: "destructive",
        description: "Você não pode enviar uma mensagem em branco",
      });
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "Message",
        to: userToChat.guid,
        msg: message,
      });
      setMessage("");
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    handleSendMsg();
  };

  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const handleEmojiSelect = (emoji: any) => {
    setShowPicker(false);
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chat]); // scrollar para baixo apos cada mensagem

  // useEffect(() => {
  //   const lastMessage = chat[chat.length - 1];

  //   if (lastMessage) {
  //     if (
  //       userToChat &&
  //       lastMessage.to_guid === myAccountInfo.guid &&
  //       userToChat.guid === lastMessage.from_guid &&
  //       !lastMessage.read
  //     ) {
  //       if (wss) {
  //         wss.sendMessage({
  //           api: "user",
  //           mt: "ChatRead",
  //           msg_id: lastMessage.id,
  //         });
  //         const currentDate = new Date().toISOString();
  //         chatRead(lastMessage.id,currentDate,currentDate)
  //         // atualizar que eu li e recebi a mensagem pois estou com o chat aberto com esse usuario
  //       }
  //     }
  //   }
  // }, [addChat]); // useEffect para monitorar as mensagens recebidas e enviadas

  useEffect(() => {
    const markMessagesAsRead = () => {
      chat.forEach((message) => {
        if (
          message.to_guid === myAccountInfo.guid &&
          message.from_guid === userToChat.guid &&
          !message.read
        ) {
          // Marcar a mensagem como lida no backend
          if (wss) {
            wss.sendMessage({
              api: "user",
              mt: "ChatRead",
              msg_id: message.id,
            });
          }
          // Atualizar o estado local para refletir que a mensagem foi lida
          const currentDate = new Date().toISOString();
          if (userToChat.guid) {
            chatRead(message.id, currentDate, currentDate);
          }
        }
      });
    };

    // Chamar a função para marcar as mensagens como lidas ao abrir o chat
    markMessagesAsRead();
  }, [chat]); // Dependências do useEffect

  const filteredMessages = chat.filter(
    (message) =>
      (message.from_guid === myAccountInfo.guid &&
        message.to_guid === userToChat.guid) ||
      (message.from_guid === userToChat.guid &&
        message.to_guid === myAccountInfo.guid)
  );

  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className="overflow-y-auto overflow-hidden h-full hide-scrollbar"
        ref={messageListRef}
      >
        {filteredMessages.map((message, index) => {
          const isMyMessage = message.from_guid === myAccountInfo.guid; // se a mensagem é minha ou não
          const messageText = message.msg || "";

          let status;
          if (isMyMessage) {
            // se for minha mensagem entao adiciona as verificações
            status = message.read
              ? "read"
              : (message.delivered ? "received" : "sent") || "sent";
          } else {
            // se nao for , entao nao coloca nada , sem o risquinho , igual no whatsapp
            status = undefined;
          }

          return (
            <MessageBox
              key={index}
              id={message.id}
              position={isMyMessage ? "right" : "left"}
              type="text"
              title={isMyMessage ? myAccountInfo.name : userToChat.name}
              text={messageText}
              className="text-black"
              status={status as any}
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

      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center gap-3 p-2">
          <Input
            placeholder="escreva algo aqui"
            value={message}
            onChange={handleInputMessage}
          />
          <div>
            {/* Botão para abrir o picker de emojis */}

            <Button
              size="icon"
              type="button"
              variant="secondary"
              className="rounded-full"
              onClick={() => setShowPicker(!showPicker)}
            >
              😀
            </Button>
            {showPicker && (
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            )}
          </div>
          <Button size="icon" type="submit" variant="ghost">
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
}
