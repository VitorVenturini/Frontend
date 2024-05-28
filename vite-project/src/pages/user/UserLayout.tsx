import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { AccountContext, useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Logout from "@/components/Logout";
import useWebSocket from "@/components/useWebSocket";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import ButtonsGridPage from "@/components/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/ButtonsContext";

import LeftGrid from "@/components/LeftGrid";
import RightGrid from "@/components/RightGrid";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

function UserLayout() {
  const account = useAccount();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const { setButtons, buttons } = useButtons();
  const [selectedOpt, setSelectedOpt] = useState<string>("floor");

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const buttons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(buttons);
        break;
      default:
        console.log("Unknown message type:", message);
        break;
    }
  };

  const handleOptChange = (newOpt: string) => {
    setSelectedOpt(newOpt);
  };

  return (
    <WebSocketProvider
      token={account.accessToken}
      onMessage={handleWebSocketMessage}
    >
      <Logout />
      <div className="flex gap-3 p-2 justify-center">
        <LeftGrid buttons={buttons} selectedUser={account}/>
        <div>
        <ButtonsGridPage buttons={buttons} selectedUser={account} onOptChange={handleOptChange}/>
        </div>
        <RightGrid buttons={buttons} selectedUser={account} selectedOpt={selectedOpt}/>
      </div>
    </WebSocketProvider>
  );
}

export default ValidadeToken(UserLayout);
