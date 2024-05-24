import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useAccount } from "./AccountContext";
import { WebSocketMessage } from "./WebSocketProvider";

export interface WebSocketHook {
  data: string;
  closeConnection: () => void;
  sendMessage: (message: WebSocketMessage) => void;
}

const useWebSocket = (
  token: string,
  onMessage?: (message: WebSocketMessage) => void
): WebSocketHook => {
  const [data, setData] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const account = useAccount();

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
        console.log(account.isAdmin);
        console.log(account);
        //ws.current?.send(JSON.stringify({ api: account.isAdmin ? "admin" : "user", mt: "AdminMessage" }));
        //ws.current?.send(JSON.stringify({ api: account.isAdmin ? "admin" : "user", mt: "SelectSensorName" }));
        ws.current?.send(JSON.stringify({ api: account.isAdmin ? "admin" : "user", mt: "SelectMessage" }));
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        if (!account.isLogged) {
          timer.current = setTimeout(() => {
            console.log("Reconnecting WebSocket...");
            connect();
          }, 5000);
        }
      };
      ws.current.onerror = (event) => {
        console.error("WebSocket error:", event);
        if (!account.isLogged) {
          timer.current = setTimeout(() => {
            console.log("Reconnecting WebSocket...");
            connect();
          }, 5000);
        }
      };

      ws.current.onmessage = (message) => {
        console.log("WebSocket message received:", message.data);
        const parsedMessage = JSON.parse(message.data);
        if (onMessage) {
          onMessage(parsedMessage);
        }
        setData(message.data);
      };
    }

    connect(); // Inicia a conexão WebSocket

    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (ws.current) ws.current.close();
    };
  }, [token]);

  const closeConnection = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (ws.current) ws.current.close();
    //if(ws.current) ws.current.onclose
  }, []);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
        console.log("WebSocketSend " + JSON.stringify(message));
      }
    },
    []
  );

  return { data, closeConnection, sendMessage };
};

export default useWebSocket;
