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

  return (
    <WebSocketProvider token={account.accessToken}>
      <div>
        <div>
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {account?.name || "Usuário"}
            </h3>
            <p className="text-sm text-muted-foreground">{account?.email}</p>
          </div>
          <Logout />
        </div>
        <LeftGrid/>
        <ButtonsGrid />
        <RightGrid />
      </div>
    </WebSocketProvider>
  );
}

export default UserLayout;
