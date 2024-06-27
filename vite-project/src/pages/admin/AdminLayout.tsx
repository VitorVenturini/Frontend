import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import Account from "./Account";
import ButtonsPage from "./ButtonsPage";
import HeaderApp from "@/components/header/HeaderApp";
import { useAccount } from "@/components/account/AccountContext";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/buttons/buttonContext/ButtonsContext";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  WebSocketProvider,
  useWebSocketData,
} from "@/components/websocket/WebSocketProvider";
import ActionsPage from "./ActionsPage";
import Options from "./Options";
import { useToast } from "@/components/ui/use-toast";
import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
import {
  ActionsInteface,
  useActions,
} from "@/components/actions/ActionsContext";

function AdminLayout() {
  const account = useAccount();
  const wss = useWebSocketData();
  const { buttons, setButtons, addButton, updateButton } = useButtons();
  const { sensors, setSensors, updateSensor } = useSensors();
  const { toast } = useToast();
  const { actions, setActions, updateActions } = useActions();
  const { updateAccount } = useAccount();
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const firstButtons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(firstButtons);
        break;
      case "InsertButtonSuccess":
        const newButton: ButtonInterface = message.result;
        addButton(newButton);
        toast({
          description: "Botão Criado com sucesso",
        });
        break;
      case "UpdateButtonSuccess":
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
