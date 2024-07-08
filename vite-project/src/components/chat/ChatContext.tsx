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
  from?: string;
  date?: string
}

interface ChatContextType {
  chat: ChatInterface[];
  setChat: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
  addChat: (chat: ChatInterface) => void;
}

const chatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chat, setChat] = useState<ChatInterface[]>([]);

  const addChat = useCallback((newMessage: ChatInterface) => {
    setChat((prevChat) => [...prevChat, newMessage]);
  }, []);

  return (
    <chatContext.Provider
      value={{
        chat,
        setChat,
        addChat,
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
