import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "@/assets/principal.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "@/components/logout/Logout";
import { useAccount } from "@/components/account/AccountContext";
import { useNavigate } from "react-router-dom";
import { Toggle } from "@radix-ui/react-toggle";
import {
  WebSocketProvider,
  useWebSocketData,
} from "@/components/websocket/WebSocketProvider";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import texts from "../../_data/texts.json";
import { useLanguage } from "../language/LanguageContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import LogoCore from "../../assets/LogoCore.svg";
import Loader2 from "../Loader2";
import useWebSocket from "@/components/websocket/useWebSocket";
import ReportLayout from "@/pages/report/ReportLayout";

export default function HeaderReport() {
  const account = useAccount();
  const { clearButtons } = useButtons();
  const { updateAccount } = useAccount();
  const navigate = useNavigate();
  const wss = useWebSocketData();
  const { language } = useLanguage();

  const handleButtonsClick = () => {
    //wss?.sendMessage({ api: account.isAdmin ? "admin" : "user", mt: "SelectMessage" });
    navigate("/admin/buttons");
  };

  const handleAccountClick = () => {
    navigate("/admin/account");
  };

  const handleActionsClick = () => {
    wss?.sendMessage({ api: "admin", mt: "SelectActions" });
    //setTimeout(() => {
    //navigate("/admin/actions");
    //}, 900);
  };

  const handleOptionsClick = () => {
    navigate("/admin/options");
  };
  const handleReportsClick = () => {
    navigate("/admin/reports");
  };
  const handleReportsLayoutClick = () => {
    navigate("/report");
  };
  const handleUserViewClick = () => {
    clearButtons();
    updateAccount({ isAdmin: false });
    navigate("/user/buttons");
  };

  return (
    <header className="flex justify-between items-center p-2">
      {wss?.isReconnecting && <Loader2 />}
      <div className="flex items-center gap-5">
        <Button className="h-16" variant="ghost" >
          <img src={LogoCore} alt="Logo" className="w- h-16" />
        </Button>

        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight capitalize">
            {account?.name || "Usuário"}
          </h3>
          <p className="text-sm text-muted-foreground">{account?.email}</p>
        </div>
      </div>

      <div className="flex items-end ">
        <div className="flex items-center gap-1">
     

          <Logout />
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
