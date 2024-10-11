import React, { useContext, useState } from "react";
import { useAccount } from "@/components/account/AccountContext";
import { initialState } from "@/components/account/AccountContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { useWebSocketData } from "@/components/websocket/WebSocketProvider"; // Importe o useWebSocketData
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

export default function Logout() {
  const { updateAccount} = useAccount();
  const account = useAccount()
  const navigate = useNavigate();
  const ws = useWebSocketData();
  const { language } = useLanguage();

  const handleLogout = () => {
   account.isLogged ? updateAccount({ isLogged: false }) : ""
    if (ws) {
      ws.closeConnection(); // Fecha a conexão WebSocket
    }
    return <Navigate to="/login" />;
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
