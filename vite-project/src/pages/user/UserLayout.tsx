import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";
import Logout from "@/components/Logout";
import useWebSocket from "@/components/useWebSocket";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import ButtonsGrid from "@/components/ButtonsGrid";
import LeftGrid from "@/components/LeftGrid";
import RightGrid from "@/components/RightGrid";

function UserLayout() {
  const account = useAccount();
  const webSocket = useWebSocket(account.accessToken)
  console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)

  return (
    <WebSocketProvider token={account.accessToken}>
       <Logout />
      <div className="flex gap-3 p-2 justify-center">
        <LeftGrid/>
        <ButtonsGrid />
        <RightGrid />
      </div>
    </WebSocketProvider>
  );
}

export default ValidadeToken(UserLayout);
