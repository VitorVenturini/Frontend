import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "../assets/principal.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "./Logout";
import { useAccount } from "@/components/AccountContext";
import { useNavigate } from "react-router-dom";
import useWebSocket from "@/components/useWebSocket";
import { WebSocketProvider, useWebSocketData } from "@/components/WebSocketProvider";

export default function HeaderApp() {
  const account = useAccount();
  const navigate = useNavigate();
  const wss = useWebSocketData()
  
  const handleButtonsClick = () => {
    wss?.sendMessage({ api: account.isAdmin ? "admin" : "user", mt: "SelectMessage" });
    //ws.sendMessage({ api: account.isAdmin ? "admin" : "user", mt: "SelectMessage" });
    navigate("/admin/buttons");
  };

  const handleAccountClick = () => {
    navigate("/admin/account");
  };

  const handleActionsClick = () => {
    navigate("/admin/actions");
  };

  const handleOptionsClick = () => {
    navigate("/admin/options");
  };

  return (
    <header className="flex justify-between items-center p-4 ">
      <div className="flex items-center gap-5">
        <img
          src={logo} // Use o logo importado aqui
          alt="Logo"
          width={200}
          height={200}
        />
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {account?.name || "Usuário"}
          </h3>
          <p className="text-sm text-muted-foreground">{account?.email}</p>
        </div>
      </div>

      <div className="flex items-end ">
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={handleButtonsClick}>
            Botões
          </Button>
          <Button variant="ghost" onClick={handleAccountClick}>
            Conta
          </Button>
          <Button variant="ghost" onClick={handleActionsClick}>
            Ações
          </Button>
          <Button variant="ghost" onClick={handleOptionsClick}>
            Opções
          </Button>
          <Logout />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
