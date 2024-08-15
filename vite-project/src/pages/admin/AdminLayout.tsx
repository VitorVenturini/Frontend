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

import {
  useUsers,
  UserInterface,
} from "@/components/users/usersCore/UserContext";
import {
  CamerasInterface,
  useCameras,
} from "@/components/cameras/CameraContext";
import { useGoogleApiKey } from "@/components/options/ApiGoogle/GooglApiContext";
import ColumnsReports from "@/Reports/collumnsReports";
import { Grafico } from "@/components/charts/lineChart";
import { DataProvider, useData } from "@/Reports/DataContext";
import Reports from "./reports";
import { usePbx } from "@/components/options/Pbx/PbxContext";
import {
  UserPbxInterface,
  useUsersPbx,
} from "@/components/users/usersPbx/UsersPbxContext";

function AdminLayout() {
  const account = useAccount();
  const { setUsers, updateUserStauts } = useUsers();
  const { updateUserPbxStauts } = useUsersPbx();
  const { setApiKeyInfo } = useGoogleApiKey();
  const { setPbxInfo } = usePbx();
  const wss = useWebSocketData();
  const { buttons, setButtons, addButton, updateButton, deleteButton } =
    useButtons();
  const { setSensors, addSensorName, clearSensors } = useSensors();
  const { toast } = useToast();
  const { actions, setActions, updateActions, deleteAction, addActions } =
    useActions();
  const { setUsersPbx } = useUsersPbx();
  const { updateAccount } = useAccount();
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const navigate = useNavigate();
  const { gateways, setGateways, updateGateway, deleteGateway, addGateway } =
    useGateways();
  const { cameras, setCameras, updateCamera, deleteCamera, addCamera } =
    useCameras();
  const [receivedFragments, setReceivedFragments] = useState<any[]>([]);
  const { addDataReport, clearDataReport } = useData();
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");

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
      case "PbxTableUsersResult":
        const pbxUser: UserPbxInterface[] = message.result;
        setUsersPbx(pbxUser);
        break;
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
        console.log(
          "UpdateActionMessageSuccess",
          JSON.stringify(message.result)
        );
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
      case "ConfigResult":
        const apiKeyEntries = message.result.filter(
          (item: any) => item.entry === "googleApiKey"
        );
        setApiKeyInfo(apiKeyEntries);
        const pbxEntries = message.result.filter(
          (item: any) => item.entry === "urlPbxTableUsers"
        );
        setPbxInfo(pbxEntries);
        break;
        // asjutar isso , armazenar nos outros contextos
        break;
      case "SelectGatewaysSuccess":
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
        const updatedGateway: GatewaysInterface = message.result;
        console.log("UpdateGatewaySuccess", JSON.stringify(message.result));
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
      case "SelectCamerasSuccess":
        const allCameras: CamerasInterface[] = message.result;
        setCameras(allCameras);
        break;
      case "AddCameraSuccess":
        console.log(JSON.stringify(message.result));
        const newCamera: CamerasInterface = message.result;
        addCamera(newCamera);
        toast({
          description: "Camera criada com sucesso",
        });
        break;
      case "UpdateCameraSuccess":
        const updatedCamera: CamerasInterface = message.result;
        console.log("UpdateCameraSuccess", JSON.stringify(message.result));
        updateCamera(updatedCamera);
        toast({
          description: "Camera atualizada com sucesso",
        });
        break;
      case "DeleteCameraSuccess":
        deleteCamera(message.id_deleted);
        toast({
          description: "Camera deletada com sucesso",
        });
        break;
      case "UserOnline":
        // nao atualizar o meu próprio status
        updateUserPbxStauts(message.guid, message.color, message.note);

        break;
      case "UserOffline":
        // nao atualizar o meu próprio status
        updateUserPbxStauts(message.guid, "offline");

        break;
      case "SelectFromReportsSuccess":
        if (message.result === "[]") {
          toast({
            description: "Relatório não gerado, revise seus parâmetros",
          });
        } else {
          setReceivedFragments((prevFragments) => {
            const newFragments = [...prevFragments, message.result];
            if (message.lastFragment) {
              const jsonData = newFragments.join("");
              let parsedData;
              let jsonKeys;

              try {
                parsedData = JSON.parse(jsonData);
                jsonKeys = Object.keys(parsedData[0]);
                // Formatar datas no formato desejado
              } catch (error) {
                console.error("Erro ao fazer o parse do JSON:", error);
                return prevFragments;
              }

              clearDataReport(); // Limpa os dados anteriores

              if (message.src === "RptSensors") {
                console.log(parsedData, "REPORT SENSOR");

                addDataReport(parsedData, "sensor", jsonKeys, message.src);
              } else {
                console.log(parsedData, "REPORT TABLE");
                // Função auxiliar para formatação de datas
                function formatDate(dateString: string): string {
                  const date = new Date(dateString);
                  return new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZoneName: "short",
                  })
                    .format(date)
                    .replace(",", " -") // Substitui a vírgula por " -"
                    .replace("GMT", "") // Remove qualquer menção ao GMT
                    .trim(); // Remove espaços em branco ao redor
                }

                parsedData = parsedData.map((item: any) => {
                  // Formatar a coluna 'date', se existir
                  if (item.date) {
                    item.date = formatDate(item.date);
                  }

                  // Formatar colunas que começam com 'call' e possuem valor
                  Object.keys(item).forEach((key) => {
                    if (key.startsWith("call") && item[key]) {
                      item[key] = formatDate(item[key]);
                    }
                  });
                  if (item.status) {
                    switch (item.status) {
                      case 3:
                        item.status = "Conectado";
                        break;
                      case 1:
                        item.status = "Não Conectado";
                        break;
                      case "stop":
                        item.status = "Interrompido";
                        break;
                      case "start":
                        item.status = "Iniciado";
                        break;
                      case "out":
                        item.status = "Saída"; 
                        break;
                      case "inc":
                        item.status = "Entrada";
                        break;
                      case "Login":
                        item.status = "Logado"; 
                        break;
                      case "Logout":
                        item.status = "Deslogado"; 
                        break;
                      default:
                        break;
                    }
                  }
                  return item;
                });

                addDataReport(parsedData, "table", jsonKeys, message.src);
              }

              return []; // Limpa os fragmentos recebidos
            } else {
              return newFragments;
            }
          });
        }
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
        <Route path="reports" element={<Reports />} />
        {/* Add more admin routes as needed */}
      </Routes>
    </WebSocketProvider>
  );
}

export default ValidadeToken(AdminLayout);
