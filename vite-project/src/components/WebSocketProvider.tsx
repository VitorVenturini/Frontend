// WebSocketContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import useWebSocket, { WebSocketHook } from "./useWebSocket";

type WebSocketContextType = WebSocketHook | null;

const WebSocketContext = createContext<WebSocketContextType>(null);

export interface WebSocketMessage {
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
  const webSocketHook = useWebSocket(token, onMessage);

  return (
    <WebSocketContext.Provider value={webSocketHook}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketData = (): WebSocketContextType =>
  useContext(WebSocketContext);
