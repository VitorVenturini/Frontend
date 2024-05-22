import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";
import Logout from "@/components/Logout";
import useWebSocket from "@/components/useWebSocket";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import ButtonsGrid from "@/components/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/ButtonsContext";

import LeftGrid from "@/components/LeftGrid";
import RightGrid from "@/components/RightGrid";

function UserLayout() {
  const account = useAccount();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const { setButtons, buttons } = useButtons();

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectMessageSuccess":
        const buttons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(buttons);
        break;
      default:
        console.log("Unknown message type:", message);
        break;
    }
  };
  return (
    <WebSocketProvider
      token={account.accessToken}
      onMessage={handleWebSocketMessage}
    >
      <Logout />
      <div className="flex gap-3 p-2 justify-center">
        <LeftGrid />
        <ButtonsGrid buttons={buttons} />
        <RightGrid />
      </div>
    </WebSocketProvider>
  );
}

export default ValidadeToken(UserLayout);
