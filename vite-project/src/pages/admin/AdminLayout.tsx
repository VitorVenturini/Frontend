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
import { useToast } from "@/components/ui/use-toast";
import { useWebSocketData } from "@/components/WebSocketProvider";
import { SensorInterface, useSensors } from "@/components/SensorContext";
import { ActionsInteface, useActions } from "@/components/ActionsContext";

function AdminLayout() {
  const account = useAccount();
  const wss = useWebSocketData();
  const { buttons, setButtons, addButton, updateButton } = useButtons();
  const { sensors, setSensors, updateSensor } = useSensors();
  const { toast } = useToast();
  const { actions, setActions, updateActions } = useActions();

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const firstButtons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(firstButtons);
        break;
      case "InsertMessageSuccess":
        const newButton: ButtonInterface = message.result;
        addButton(newButton);
        toast({
          description: "Botão Criado com sucesso",
        });
        break;
      case "UpdateMessageSuccess":
        const updatedButton: ButtonInterface = message.result;
        updateButton(updatedButton);
        toast({
          description: "Botão Atualizado com sucesso",
        });
        break;
      case "DeleteButtonsSuccess":
        const buttonsAfterDelete: ButtonInterface[] = message.btns;
        setButtons(buttonsAfterDelete);
        toast({
          description: "Botão excluído com sucesso",
        });
        break;
      case "SelectSensorNameResult":
        const firstSensors: SensorInterface[] = JSON.parse(message.result);
        setSensors(firstSensors);
        console.log(message.result);
        break;
      case "SelectActionsMessageSuccess":
        console.log("allActions ", JSON.stringify(message.result));
        const allActions: ActionsInteface[] = JSON.parse(message.result);
        setActions(allActions);
        break;
      case "InsertActionMessageSuccess":
        console.log(JSON.stringify(message.result));
        const newAction: ActionsInteface = message.result;
        updateActions(newAction);
        toast({
          description: "Ação Criado com sucesso",
        });
        break;
      case "DeleteActionsMessageSuccess":
        console.log(JSON.stringify(message.actions));
        const actionsAfterDelete: ActionsInteface[] = message.actions;
        setActions(actionsAfterDelete);
        toast({
          description: "Ação Deletada com sucesso",
        });
        break;
      default:
        console.log("Unknown message type:", message.mt);
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
