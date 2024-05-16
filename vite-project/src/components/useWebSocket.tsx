import { useEffect, useRef, useState, useCallback,useContext } from "react";
import { useAccount } from "./AccountContext";
import { IsAdminContext } from "./IsAdmContext";

export interface WebSocketHook {
    data: string;
    closeConnection: () => void;
  }

const useWebSocket = (token: string,) => {
  const [data, setData] = useState(null);
  const ws = useRef<WebSocket | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { isAdmin } = useContext(IsAdminContext);

  useEffect(() => {
    const currentUrl = window.location.hostname;
    let wsUrl = "";
    if (window.location.protocol === "http:") {
      // wsUrl = 'ws://' + currentUrl + ':10000?token=' + token;
      wsUrl = "wss://meet.wecom.com.br:10000?token=" + token;
    } else {
      wsUrl = "wss://" + currentUrl + ":10000?token=" + token;
    }

    function connect() {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        if (timer.current) clearTimeout(timer.current);
        console.log("WebSocket connection opened");
        console.log("isAdmin", isAdmin);
        ws.current?.send(JSON.stringify({ api: isAdmin ? "admin" : "user", mt: "UserSession" }));
    };

      ws.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        if (timer.current) clearTimeout(timer.current as NodeJS.Timeout);
        timer.current = setTimeout(connect, 10000); // Tenta reconectar após 10 segundos
      };

      ws.current.onerror = (event) => {
        console.error("WebSocket error:", event);
      };

      ws.current.onmessage = (message) => {
        console.log("WebSocket message received:", message.data);
        setData(message.data);
      };
    }

    connect(); // Inicia a conexão WebSocket

    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (ws.current) ws.current.close();
    };
  }, [token,]);
  const closeConnection = useCallback(() => {
    // Feche a conexão WebSocket aqui
    // ...
  }, []);

  return { data, closeConnection };
};

export default useWebSocket;
