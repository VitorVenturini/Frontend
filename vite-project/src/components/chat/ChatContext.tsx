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
  msg?: string;
  guid?: string;
  src?: string;
  to?: string;
  from?: string;
}

interface ChatContextType {
  chat: ChatInterface[];
  setChat: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
  addChat: (chat: ChatInterface) => void;
}

const chatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chat, setChat] = useState<ChatInterface[]>([]);

  const addChat = (chat: ChatInterface) => {
    setChat((prevChat) => [...prevChat, chat]);
    console.log("Atualizou o contexto")
  };

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
