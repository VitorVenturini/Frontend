import { Image, Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserInterface, useUsers } from "../users/usersCore/UserContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState, useRef } from "react";
import { ChatInterface, useChat } from "./ChatContext";
import React from "react";
import { MessageBox, SystemMessage } from "react-chat-elements";
import "react-chat-elements/dist/main.css"; // CSS da biblioteca de chat
import { toast } from "../ui/use-toast";
import { useAccount } from "../account/AccountContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Label } from "../ui/label";
import { isBase64File } from "../utils/utilityFunctions";
import { format, isToday, isYesterday } from "date-fns";

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
    event.preventDefault();
    handleSendMsg();
  };

  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleEmojiSelect = (emoji: any) => {
    setShowPicker(false);
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        wss?.sendMessage({
          api: "user",
          mt: "Message",
          to: userToChat.guid,
          msg: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    const markMessagesAsRead = () => {
      chat.forEach((message) => {
        if (
          message.to_guid === myAccountInfo.guid &&
          message.from_guid === userToChat.guid &&
          !message.read
        ) {
          if (wss) {
            wss.sendMessage({
              api: "user",
              mt: "ChatRead",
              msg_id: message.id,
            });
          }
          const currentDate = new Date().toISOString();
          if (userToChat.guid) {
            chatRead(message.id, currentDate, currentDate);
          }
        }
      });
    };
    markMessagesAsRead();
  }, [chat]);

  const filteredMessages = chat.filter(
    (message) =>
      (message.from_guid === myAccountInfo.guid &&
        message.to_guid === userToChat.guid) ||
      (message.from_guid === userToChat.guid &&
        message.to_guid === myAccountInfo.guid)
  );

  function formatDateForSeparator(date: Date) {
    const clientDate = new Date(date);

    if (isToday(clientDate)) {
      return "Hoje";
    } else if (isYesterday(clientDate)) {
      return "Ontem";
    } else {
      return format(clientDate, "dd/MM/yyyy");
    }
  }

  let lastMessageDate: string | null = null;

  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className="overflow-y-auto overflow-hidden h-full hide-scrollbar"
        ref={messageListRef}
      >
        {filteredMessages.map((message, index) => {
          const isMyMessage = message.from_guid === myAccountInfo.guid;
          const messageText = message.msg || "";
          const messageDate = new Date(message.date as string);
          const formattedDate = formatDateForSeparator(messageDate);

          let status;
          if (isMyMessage) {
            status = message.read
              ? "read"
              : (message.delivered ? "received" : "sent") || "sent";
          } else {
            status = undefined;
          }

          const shouldShowDateSeparator =
            !lastMessageDate || lastMessageDate !== formattedDate;
          lastMessageDate = formattedDate;

          return (
            <React.Fragment key={message.id}>
              {shouldShowDateSeparator && (
                <SystemMessage
                  id={message.id}
                  position="center"
                  title=""
                  text={formattedDate}
                  focus={false}
                  date={0}
                  titleColor=""
                  forwarded={false}
                  status="received"
                  notch={false}
                  retracted={false}
                  type="system"
                  className="text-black "
                  replyButton={false}
                  removeButton={false}
                />
              )}
              {isBase64File(messageText) ? (
                <MessageBox
                  id={message.id}
                  position={isMyMessage ? "right" : "left"}
                  title={isMyMessage ? myAccountInfo.name : userToChat.name}
                  className="text-black"
                  focus={false}
                  date={messageDate}
                  dateString={format(messageDate, "HH:mm")}
                  titleColor={isMyMessage ? "blue" : "green"}
                  data={{
                    uri: messageText,
                    status: status as any,
                    width: 200,
                    height: 200,
                    alt: "image",
                  }}
                  text=""
                  forwarded={false}
                  replyButton={false}
                  removeButton={false}
                  notch={false}
                  retracted={false}
                  status={status as any}
                  type="photo"
                />
              ) : (
                <MessageBox
                  id={message.id}
                  position={isMyMessage ? "right" : "left"}
                  type="text"
                  title={isMyMessage ? myAccountInfo.name : userToChat.name}
                  text={messageText}
                  className="text-black"
                  status={status as any}
                  focus={false}
                  date={messageDate}
                  dateString={format(messageDate, "HH:mm")}
                  titleColor={isMyMessage ? "blue" : "green"}
                  forwarded={false}
                  replyButton={false}
                  removeButton={false}
                  notch={false}
                  retracted={false}
                />
              )}
            </React.Fragment>
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center gap-3 p-2">
          <Input
            placeholder="escreva algo aqui"
            value={message}
            onChange={handleInputMessage}
          />
          <div>
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
          <div>
            <Button
              size="icon"
              type="button"
              variant="secondary"
              className="rounded-full"
            >
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Image />
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>
          </div>
          <Button size="icon" type="submit" variant="ghost">
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
}
