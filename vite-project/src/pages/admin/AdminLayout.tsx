import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import ButtonsPage from "./ButtonsPage";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/ButtonsContext";
import ButtonsGrid from "@/components/ButtonsGridPages";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import { WebSocketMessage } from "@/components/WebSocketProvider";
import ActionsPage from "./ActionsPage";
import Options from "./Options";
import Loader from "@/components/Loader";
import useWebSocket from "@/components/useWebSocket";

function AdminLayout() {
  const account = useAccount();
  const { buttons, setButtons, updateButton } = useButtons();
  //const [isLoading, setIsLoading] = useState(true);

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectMessageSuccess":
         //atualizar para SelectButtonsSuccess
        const buttons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(buttons);
        // setIsLoading(false); // Definindo que os dados foram carregado
        //console.log("isLoading atualizado para false");
        break;
      case "InsertMessageSuccess":
        console.log("Resultado" + JSON.stringify(message.result))
        const newButton: ButtonInterface = message.result
        updateButton(newButton);
        break;
      default:
        console.log("Unknown message type:", message);
        break;
    }
  };

  return (
    <WebSocketProvider
      token={account.accessToken}
      onMessage={handleWebSocketMessage}
    >
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<ButtonsPage />} />
        <Route path="actions" element={<ActionsPage />} />
        <Route path="options" element={<Options />} />
        {/* Add more admin routes as needed */}
      </Routes>
    </WebSocketProvider>
  );
}

export default ValidadeToken(AdminLayout);
