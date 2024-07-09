// {api: 'user', mt: 'Message', src: '487675116219135218', msg: 'sexo', id: '6'}
// api// : // "user"
// id// : // "6"
// msg// : // "sexo"
// mt// : // "Message"
// src// :
// "487675116219135218"

import React, { createContext, useState, useContext, ReactNode } from "react";
import { useCallback } from "react";
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
  userConnected?: boolean

}
interface ChatContextType {
  chat: ChatInterface[];
  setChat: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
  addChat: (chat: ChatInterface, userConnected?: boolean) => void;
  chatDelivered: (msg_id: number, deliveredDate: string) => void;
  chatRead: (msg_id: number, deliveredDate: string, readDate: string) => void;
}

const chatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chat, setChat] = useState<ChatInterface[]>([]);

  const addChat = (newMessage: ChatInterface, userConnected?: boolean) => {
    setChat((prevChat) => {
      const messageWithUserConnected = { ...newMessage, userConnected };
      return [...prevChat, messageWithUserConnected];
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
        addChat,
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
