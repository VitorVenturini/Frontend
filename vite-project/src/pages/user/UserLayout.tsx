import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";
import Logout from "@/components/Logout";
import useWebSocket from "@/components/useWebSocket";
import { WebSocketProvider } from "@/components/WebSocketProvider";

function UserLayout() {
  const  account  = useAccount();
  
  return (
    <WebSocketProvider token={account.accessToken}>

    <div>
      <h1>Usuário layout</h1>
      <Logout/>
    </div>
    </WebSocketProvider>
  );
}

export default UserLayout;
