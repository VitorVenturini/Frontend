import React, { useContext } from "react";
import { useAccount } from "@/components/AccountContext";
import { initialState } from "@/components/AccountContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWebSocketData } from "./WebSocketProvider"; // Importe o useWebSocketData
import texts from "@/_data/texts.json";
import { useLanguage } from "./LanguageContext";

export default function Logout() {
  const { updateAccount } = useAccount();
  const navigate = useNavigate();
  const ws = useWebSocketData();
  const { language } = useLanguage();

  const handleLogout = () => {
    localStorage.clear();
    updateAccount(initialState);
    if (ws) {
      ws.closeConnection(); // Fecha a conexão WebSocket
    }
    navigate("/login");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost">{texts[language].logoutButton}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {texts[language].logoutConfirmation}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {texts[language].logoutDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{texts[language].cancel}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <a onClick={handleLogout}>{texts[language].logout}</a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
