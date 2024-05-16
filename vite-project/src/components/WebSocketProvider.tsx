// WebSocketContext.tsx

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useWebSocket, { WebSocketHook } from './useWebSocket';

type WebSocketContextType = {
    data: string | null;
    closeConnection: () => void;
  } | null;

const WebSocketContext = createContext<WebSocketContextType>(null);

interface WebSocketProviderProps {
  token: string;
  children: ReactNode;
}

export const WebSocketProvider = ({ token, children }: WebSocketProviderProps) => {
  const webSocketHook = useWebSocket(token);

  return (
    <WebSocketContext.Provider value={webSocketHook}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketData = (): WebSocketContextType => useContext(WebSocketContext);