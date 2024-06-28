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
  const { buttons, setButtons, addButton, updateButton, deleteButton } =
    useButtons();
  const { sensors, setSensors, updateSensor, addSensorName } = useSensors();
  const { toast } = useToast();
  const { actions, setActions, updateActions, deleteAction,addActions } = useActions();
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
        // const buttonsAfterDelete: ButtonInterface[] = message.btns;
        // setButtons(buttonsAfterDelete);
        toast({
          description: "Botão excluído com sucesso",
        });
        deleteButton(message.id_deleted);
        break;
      // case "SelectSensorNameResult":
      //   //Lógica antiga vamos deixar comentado por enquanto
      //   // const firstSensors: SensorInterface[] = JSON.parse(message.result);
      //   // setSensors(firstSensors);
      //   // console.log(message.result);
      //   break;
        case "SelectSensorNameResult":
          const devices = message.result[0].devices;
          const firstSensors = devices.map((device: { name: string; description: string; devEUI: string }) => ({
            name: device.name,
            description: device.description,
            devEUI: device.devEUI,
          }));
          addSensorName(firstSensors);
          break;
      case "SelectActionsMessageSuccess":
        console.log("allActions ", JSON.stringify(message.result));
        const allActions: ActionsInteface[] = JSON.parse(message.result);
        setActions(allActions);
        break;
      case "InsertActionMessageSuccess":
        console.log(JSON.stringify(message.result));
        const newAction: ActionsInteface = message.result;
        addActions(newAction);
        toast({
          description: "Ação Criada com sucesso",
        });
        break;
        case "UpdateActionMessageSuccess":
          const updatedAction: ActionsInteface = message.result;
          updateActions(updatedAction);
          toast({
            description: "Ação Atualizada com sucesso",
          });
          break;
      case "DeleteActionsMessageSuccess":
        deleteAction(message.id_deleted);
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
