// {api: 'user', mt: 'Message', src: '487675116219135218', msg: 'sexo', id: '6'}
// api// : // "user"
// id// : // "6"
// msg// : // "sexo"
// mt// : // "Message"
// src// :
// "487675116219135218"

import React, { createContext, useState, useContext, ReactNode } from "react";
export interface ChatInterface {
  id: number;
  chat_id?: string;
  msg?: string;
  from_guid?: string;
  src?: string;
  to_guid?: string;
  date?: string | Date;
  delivered?: string;
  read?: string;
}
interface ChatContextType {
  chat: ChatInterface[];
  setChat: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
  addChat: (chat: ChatInterface) => void;
  addChatMessage: (chat: ChatInterface) => void;
  chatDelivered: (msg_id: number, deliveredDate: string) => void;
  chatRead: (msg_id: number, deliveredDate: string, readDate: string) => void;
  allMessages: (newMessage: ChatInterface[]) => void;
}

const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
const chatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chat, setChat] = useState<ChatInterface[]>([]);

  const addChat = (newMessage: ChatInterface) => {
    setChat((prevChat) => [...prevChat, newMessage]);
  };

  const addChatMessage = (newMessage: ChatInterface) => {
    setChat((prevChat) => [...prevChat, newMessage]);
  };

  const allMessages = (newMessages: ChatInterface[]) => {
    setChat((prevChat) => {
      // Filtra as mensagens que não pertencem ao usuário específico
      const myAccountInfoGuid = myAccountInfo.guid ; // Substitua pelo GUID do seu usuário
      const otherUserGuid = newMessages.length > 0 ? newMessages[0].from_guid === myAccountInfoGuid ? newMessages[0].to_guid : newMessages[0].from_guid : null;
  
      if (!otherUserGuid) return prevChat; // Caso não tenha novas mensagens, retorna o estado anterior
  
      return prevChat.filter(
        (message) =>
          !(
            (message.from_guid === myAccountInfoGuid && message.to_guid === otherUserGuid) ||
            (message.from_guid === otherUserGuid && message.to_guid === myAccountInfoGuid)
          )
      ).concat(newMessages);
    });
  };

  const chatDelivered = (msg_id: number, deliveredDate: string) => {
    setChat((prevChat) =>
      prevChat.map((message) =>
        message.id === msg_id
          ? { ...message, delivered: deliveredDate }
          : message
      )
    );
  };

  const chatRead = (
    msg_id: number,
    deliveredDate: string,
    readDate: string
  ) => {
    setChat((prevChat) =>
      prevChat.map((message) =>
        message.id === msg_id
          ? { ...message, delivered: deliveredDate, read: readDate }
          : message
      )
    );
  };

  return (
    <chatContext.Provider
      value={{
        chat,
        setChat,
        allMessages,
        addChat,
        addChatMessage,
        chatDelivered,
        chatRead,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(chatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
