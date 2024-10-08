import React, { createContext, useContext, ReactNode } from "react";
import useWebSocket, { WebSocketHook } from "./useWebSocket";

type WebSocketContextType = WebSocketHook | null;

const WebSocketContext = createContext<WebSocketContextType>(null);

export interface WebSocketMessage {
  api: string;
  mt: string; // Message type
  [key: string]: any; // Additional dynamic properties
}

interface WebSocketProviderProps {
  token: string;
  children: ReactNode;
  onMessage?: (message: WebSocketMessage) => void;
}

export const WebSocketProvider = ({
  token,
  children,
  onMessage,
}: WebSocketProviderProps) => {
  // Chamar o hook diretamente no componente, sem useMemo
  const webSocketHook = useWebSocket(token, onMessage);

  return (
    <WebSocketContext.Provider value={webSocketHook}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketData = (): WebSocketContextType =>
  useContext(WebSocketContext);
