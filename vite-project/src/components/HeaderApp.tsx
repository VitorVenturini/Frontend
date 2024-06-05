import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "../assets/principal.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "./Logout";
import { useAccount } from "@/components/AccountContext";
import { useNavigate } from "react-router-dom";
import useWebSocket from "@/components/useWebSocket";
import {
  WebSocketProvider,
  useWebSocketData,
} from "@/components/WebSocketProvider";
import { LanguageToggle } from "./LanguageToggle";
import texts from "../_data/texts.json";
import { useLanguage } from "./LanguageContext";
import { useButtons } from "./ButtonsContext";

export default function HeaderApp() {
  const account = useAccount();
  const {clearButtons} = useButtons()

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
    navigate("/admin/actions");
  };

  const handleOptionsClick = () => {
    navigate("/admin/options");
  };
  const handleUserViewClick = () => {
    //clearButtons()
    updateAccount({ isAdmin: false });
    navigate("/user/buttons");
  };

  return (
    <header className="flex justify-between items-center p-2 mb-3">
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
          <Button variant="ghost" onClick={handleUserViewClick}>
            {texts[language].headerUser}
          </Button>
          <Button variant="ghost" onClick={handleButtonsClick}>
            {texts[language].headerButtons}
          </Button>
          <Button variant="ghost" onClick={handleAccountClick}>
            {texts[language].headerAccount}
          </Button>
          <Button variant="ghost" onClick={handleActionsClick}>
            {texts[language].headerActions}
          </Button>
          <Button variant="ghost" onClick={handleOptionsClick}>
            {texts[language].headerOptions}
          </Button>
          <Logout />
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
