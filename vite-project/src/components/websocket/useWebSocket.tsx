import { useEffect, useRef, useState, useCallback } from "react";
import { useAccount } from "@/components/account/AccountContext";
import { WebSocketMessage } from "./WebSocketProvider";
import { useNavigate } from "react-router-dom";

export interface WebSocketHook {
  data: string;
  closeConnection: () => void;
  sendMessage: (message: WebSocketMessage) => void;
  isReconnecting: boolean;
}

const useWebSocket = (
  token: string,
  onMessage?: (message: WebSocketMessage) => void
): WebSocketHook => {
  const [data, setData] = useState("");
  const [isReconnecting, setIsReconnecting] = useState(false); // Adiciona o estado de reconexão
  const ws = useRef<WebSocket | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const pingTimer = useRef<NodeJS.Timeout | null>(null);
  const account = useAccount();
  const [initialized, setInitialized] = useState(false);
  const [shouldSendMessages, setShouldSendMessages] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!account.isLogged) return;

    const currentUrl = window.location.hostname;
    let wsUrl = "";
    if (window.location.protocol === "http:") {
      wsUrl = "wss://core.wecom.com.br:443/ws?token=" + token;
    } else {
      if (window.location.hostname === "frontend-delta-lake.vercel.app") {
        wsUrl = "wss://core.wecom.com.br:443/ws?token=" + token;
      } else {
        wsUrl = "wss://" + currentUrl + ":443/ws?token=" + token;
      }
    }

    function connect() {
      ws.current = new WebSocket(wsUrl);
      ws.current.onopen = () => {
        if (timer.current) clearTimeout(timer.current);
        if (pingTimer.current) clearInterval(pingTimer.current);
        console.log("WebSocket connection opened");
        setIsReconnecting(false);
        pingTimer.current = setInterval(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current?.send(
              JSON.stringify({
                mt: "Ping",
              })
            );

            console.log("WebSocket Send { mt: Ping }");
          }
        }, 60000);
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        if (pingTimer.current) clearInterval(pingTimer.current);
        if (event.code === 1006) {
          //code 1006 significa que a conexão foi fechada pelo servidor
          setIsReconnecting(true); // Ativa o loader
          timer.current = setTimeout(() => {
            console.log("Reconnecting WebSocket...");
            connect();
          }, 5000);
        } 
      };

      ws.current.onmessage = (message) => {
        console.log("WebSocket message received:", message.data);
        const parsedMessage = JSON.parse(message.data);
        if (parsedMessage.mt === "UserSessionResult") {
          setShouldSendMessages(true);
        } else if (parsedMessage.mt === "Message") {
          // enviar confirmação de recebimento de mensagem
          ws.current?.send(
            JSON.stringify({
              api: "user",
              mt: "ChatDelivered",
              msg_id: parsedMessage.result[0].id,
            })
          );
        }
        // else if (parsedMessage.mt === "TableUsersResult") {
        //   ws.current?.send(
        //     JSON.stringify({
        //       api: "user",
        //       mt: "SelectUserPreferences",
        //       guid: account.guid,
        //     })
        //   );
        // }
        if (onMessage) {
          onMessage(parsedMessage);
        }
        setData(message.data);
      };
    }

    // Inicia a conexão apenas se já não estiver inicializada
    if (!initialized) {
      connect(); // inicia conexão com websocket
      setInitialized(true);
    }

    return () => {
      if (pingTimer.current) clearInterval(pingTimer.current);
      if (timer.current) clearTimeout(timer.current);
      if (ws.current) ws.current.close();
    };
  }, [token]);

  useEffect(() => {
    if (
      !initialized ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN ||
      !shouldSendMessages
    )
      return;

    const apiType = account.isAdmin ? "admin" : "user";
    if (account.isAdmin) {
      ws.current?.send(JSON.stringify({ api: apiType, mt: "SelectButtons" }));
      ws.current?.send(JSON.stringify({ api: apiType, mt: "SelectSensors" }));
      ws.current?.send(JSON.stringify({ api: apiType, mt: "TableUsers" }));
      ws.current?.send(JSON.stringify({ api: apiType, mt: "SelectGateways" }));
      ws.current?.send(JSON.stringify({ api: apiType, mt: "SelectCameras" }));
    } else {
      // else para usuario
      ws.current?.send(JSON.stringify({ api: apiType, mt: "SelectButtons" }));
      ws.current?.send(JSON.stringify({ api: apiType, mt: "TableUsers" }));
      ws.current?.send(
        JSON.stringify({ api: apiType, mt: "SelectAllSensorInfoSrc" })
      );

      ws.current?.send(
        JSON.stringify({ api: apiType, mt: "getHistory", startId: null })
      );
    }

    // Reset the flag to avoid sending messages again unless UserSessionResult is received again
    setShouldSendMessages(false);
  }, [account.isAdmin, initialized, shouldSendMessages]);

  const closeConnection = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (ws.current) ws.current.close();
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log("WebSocketSend " + JSON.stringify(message));
    }
  }, []);

  return { data, closeConnection, sendMessage, isReconnecting };
};

export default useWebSocket;
