import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import Account from "./Account";
import ButtonsPage from "./ButtonsPage";
import HeaderApp from "@/components/header/HeaderApp";
import { useAccount } from "@/components/account/AccountContext";
import { useNavigate } from "react-router-dom";
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
import {
  GatewaysInterface,
  useGateways,
} from "@/components/Gateways/GatewaysContext";

import { useUsers } from "@/components/user/UserContext";
import { UserInterface } from "@/components/user/UserContext";
function AdminLayout() {
  const account = useAccount();
  const { setUsers } = useUsers();
  const wss = useWebSocketData();
  const { buttons, setButtons, addButton, updateButton, deleteButton } =
    useButtons();
  const { setSensors, addSensorName, clearSensors } = useSensors();
  const { toast } = useToast();
  const { actions, setActions, updateActions, deleteAction, addActions } =
    useActions();
  const { updateAccount } = useAccount();
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const navigate = useNavigate();
  const { gateways, setGateways, updateGateway, deleteGateway, addGateway } =
    useGateways();

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
        toast({
          description: "Botão excluído com sucesso",
        });
        deleteButton(message.id_deleted);
        break;
      case "TableUsersResult":
        const newUser: UserInterface[] = message.result;
        setUsers(newUser);
        break;

      // case "SelectSensorNameResult":
      //   //Lógica antiga vamos deixar comentado por enquanto
      //   // const firstSensors: SensorInterface[] = JSON.parse(message.result);
      //   // setSensors(firstSensors);
      //   // console.log(message.result);
      //   break;
      case "SelectSensorsResult":
        const result = message.result;
        const sensorData = result.map((gatewayData: any) => {
          const gateway_id = Object.keys(gatewayData)[0];
          const devices = gatewayData[gateway_id].devices.map(
            (device: any) => ({
              name: device.name,
              description: device.description,
              devEUI: device.devEUI,
              parameters: device.parameters,
            })
          );

          return { gateway_id, devices };
        });
        setSensors([]);
        clearSensors();
        addSensorName(sensorData);
        break;
      case "SelectActionsMessageSuccess":
        console.log("allActions ", JSON.stringify(message.result));
        const allActions: ActionsInteface[] = JSON.parse(message.result);
        setActions(allActions);
        navigate("/admin/actions");
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
        console.log("UpdateActionMessageSuccess", JSON.stringify(message.result))
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
      case "SelectGatewaysSuccess":
        console.log(
          "SelectGatewaysSuccess ALLGATEWAYS",
          JSON.stringify(message.result)
        );
        const allGateways: GatewaysInterface[] = message.result;
        setGateways(allGateways);
        break;
      case "AddGatewaySuccess":
        console.log(JSON.stringify(message.result));
        const newGateway: GatewaysInterface = message.result;
        addGateway(newGateway);
        toast({
          description: "Gateway criado com sucesso",
        });
        break;
      case "UpdateGatewaySuccess":
        const updatedGateway: GatewaysInterface = message.gateways;
        console.log("UpdateGatewaySuccess", JSON.stringify(message.gateways));
        updateGateway(updatedGateway);
        toast({
          description: "Gateway atualizado com sucesso",
        });
        break;
      case "DeleteGatewaySuccess":
        deleteGateway(message.id_deleted);
        toast({
          description: "Gateway deletado com sucesso",
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
