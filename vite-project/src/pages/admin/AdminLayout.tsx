import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import ButtonsPage from "./ButtonsPage"
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { WebSocketProvider } from "@/components/WebSocketProvider";
import { WebSocketMessage } from "@/components/WebSocketProvider";
import ActionsPage from "./ActionsPage";

import Options from "./Options";

interface Button {
  id: string;
  button_name: string;
  button_prt: string;
  button_prt_user: string;
  button_user: string;
  button_type: string;
  button_type_1: string;

}

function AdminLayout() {
  const  account  = useAccount();
  const[listButtons, setListUsers] = useState<[]>()
  console.log(account+" account");
  console.log(account?.guid +" guid");

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.mt) {
      case 'SelectMessage':
        // console.log('UserSessionResult received Msg:', message.session);
        break;
      default:
        console.log('Unknown message type:', message);
        break;
    }
  };

  return (
    <WebSocketProvider token={account.accessToken} onMessage={handleWebSocketMessage}>
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<ButtonsPage/>} />
        <Route path="actions" element={<ActionsPage/>} />
        <Route path="options" element={<Options/>} />
        {/* Add more admin routes as needed */}
      </Routes>
    </WebSocketProvider>
  );
}

export default ValidadeToken(AdminLayout);