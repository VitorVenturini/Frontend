import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import Account from "./Account";
import ButtonsPage from "./ButtonsPage";
import HeaderApp from "@/components/header/HeaderAdmin";
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
import ColumnsReports from "@/Reports/collumnsReports";
import { Grafico } from "@/components/charts/lineChart";
import { DataProvider, useData } from "@/Reports/DataContext";
import Reports from "./reports";
import {
  UserPbxInterface,
  useUsersPbx,
} from "@/components/users/usersPbx/UsersPbxContext";
import { useAppConfig } from "@/components/options/ConfigContext";
import Loader from "@/components/Loader";
import useWebSocket from "@/components/websocket/useWebSocket";
import Loader2 from "@/components/Loader2";

function AdminLayout() {
  const account = useAccount();
  const { setUsers, updateUserStauts } = useUsers();
  const { updateUserPbxStauts } = useUsersPbx();
  const { updateLicense } = useAppConfig();
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
  const [isLoading, setIsLoading] = useState(true);
  var pbxUser: UserPbxInterface[];
  const { setLoadBarData, clearLoadBarData, setApiKeyInfo, setPbxStatus } =
    useAppConfig();
  var allBtn: ButtonInterface[];
  const { isReconnecting } = useWebSocket(account.accessToken);
  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const firstButtons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(firstButtons);
        allBtn = firstButtons;
        setIsLoading(false);
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
        const PbxUsers: UserPbxInterface[] = message.result;
        setUsersPbx(PbxUsers);
        pbxUser = PbxUsers;
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
        // Filtra as entradas para a Google API Key
        const apiKeyEntries = message.result.filter(
          (item: any) => item.entry === "googleApiKey"
        );
        setApiKeyInfo(apiKeyEntries);

        console.log("adminPBXUSer", message.result);

        // Filtra as entradas para pbxEntries e pbxType
        const pbxEntries = message.result.filter(
          (item: any) => item.entry === "urlPbxTableUsers"
        );
        const pbxType = message.result.filter(
          (item: any) => item.entry === "pbxType"
        );

        // Combina pbxEntries e pbxType em um único array
        const pbxData = [...pbxEntries, ...pbxType];

        // Envia a informação combinada ao contexto
        setPbxStatus(pbxData);

        break;
      case "PbxStatusResult":
        if (message.result) {
          const status = String(message.result);
          setPbxStatus((prevPbxStatus) => {
            return prevPbxStatus.map((pbx) =>
              pbx.entry === "urlPbxTableUsers" ? { ...pbx, status } : pbx
            );
          });
        }
        break;
      case "ConfigLicenseResult":
        console.log("Received ConfigLicenseResult message:", message);

        const licenseKey = message.licenseKey;
        const licenseFile = message.licenseFile;
        const licenseActive = JSON.parse(message.licenseActive);
        const licenseInstallDate = message.licenseInstallDate;

        updateLicense(
          licenseKey,
          licenseFile,
          licenseActive,
          licenseInstallDate
        );

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
        if (pbxUser.length > 0) {
          updateUserPbxStauts(message.guid, message.color, message.note);
        }
        break;
      case "UserOffline":
        if (pbxUser.length > 0) {
          updateUserPbxStauts(message.guid, "offline", "offline");
        }
        break;
      case "ConnRemovedByAdmin":
        const currentSession = localStorage.getItem("currentSession");
        localStorage.removeItem(currentSession as string);
        localStorage.removeItem("currentSession");
        navigate("/login");
        localStorage.setItem("disconnected", message.from);
        // message.from
        break;
      case "CoreUserOnline":
        updateUserStauts(message.guid, "online");
        break;
      case "CoreUserOffline":
        updateUserStauts(message.guid, "offline");
        break;
      case "SelectFromReportsSuccess":
        if (message.result === "[]") {
          toast({
            description: "Relatório não gerado, revise seus parâmetros",
          });
        } else {
          clearDataReport();
          clearLoadBarData();
          setLoadBarData({
            total: message.totalFragments,
            unitValue: message.thisFragment,
          });

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
                  // Formatar a coluna 'date' ou outras que armazenam datas, se existirem
                  if (item.date) {
                    item.date = formatDate(item.date);
                  }
                  if (item.delivered) {
                    item.delivered = formatDate(item.delivered);
                  }
                  if (item.read) {
                    item.read = formatDate(item.read);
                  }
                  // para os details de atividades. filtrar o ID do botão e exibir o nome
                  if (item.details && item.details !== "APP") {
                    const filteredButton = allBtn?.filter((btn) => {
                      return btn.id === item.details;
                    })[0];
                    item.details = filteredButton?.button_name;
                  }
                  // Formatar colunas que começam com 'call' e possuem valor
                  Object.keys(item).forEach((key) => {
                    if (
                      key.startsWith("call") &&
                      item[key] &&
                      !key.startsWith("call_innovaphone")
                    ) {
                      item[key] = formatDate(item[key]);
                    }
                  });
                  if (item.status || item.direction) {
                    switch (item.status) {
                      case 3:
                        item.status = "Finalizado";
                        break;
                      case 1:
                        item.status = "Em andamento";
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
                    switch (item.direction) {
                      case "out":
                        item.direction = "Saída";
                        break;
                      case "inc":
                        item.direction = "Entrada";
                        break;
                      default:
                        break;
                    }
                  }

                  return item;
                });
                if (message.src === "RptIotHistory") {
                  console.log("RPT IOT HYSTORY", parsedData);
                  addDataReport(parsedData, "img", jsonKeys, message.src);
                  clearLoadBarData();
                } else {
                  addDataReport(parsedData, "table", jsonKeys, message.src);
                  clearLoadBarData();
                }
              }

              return []; // Limpa os fragmentos recebidos
            } else {
              return newFragments;
            }
          });
        }
        break;

      case "AddGatewayError":
        toast({
          variant: "destructive",
          title: "Limite Atingido",
          description: "Máximo de Gateways cadastrados verifique sua licença",
        });
        break;
      case "DelConnUserResult":
        toast({
          variant: "destructive",
          title: "Usuário Desconectado",
          description: "Usuário foi desconectado de sua sessão",
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
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <>
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
            </>
          )}
        </>
  
    </WebSocketProvider>
  );
}

export default ValidadeToken(AdminLayout);
