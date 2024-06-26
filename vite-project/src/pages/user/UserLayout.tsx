import { Routes, Route, useNavigate } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import {
  AccountContext,
  useAccount,
} from "@/components/account/AccountContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Logout from "@/components/logout/Logout";
import { WebSocketProvider } from "@/components/websocket/WebSocketProvider";
import ButtonsGridPage from "@/components/buttons/buttonsGrid/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/buttons/buttonContext/ButtonsContext";

import LeftGrid from "@/components/leftGrid/LeftGrid";
import RightGrid from "@/components/rightGrid/RightGrid";
import { Ghost } from "lucide-react";
import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useHistory } from "@/components/history/HistoryContext";
import { useEffect } from "node_modules/react-resizable-panels/dist/declarations/src/vendor/react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

function UserLayout() {
  const account = useAccount();
  const { toast } = useToast();
  const { updateAccount } = useAccount();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const {
    setButtons,
    setButtonTriggered,
    setStopButtonTriggered,
    addButton,
    deleteButton,
    updateButton,
    buttons,
  } = useButtons();
  const {
    setSensors,
    updateSensor,
    replaceLatestSensor,
    clearSensorsByName,
    addSensors,
    addSensorName
  } = useSensors();
  const { addHistory, updateHistory } = useHistory();
  const [selectedOpt, setSelectedOpt] = useState<string>("floor");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState("");
  const wss = useWebSocketData();

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const buttons: ButtonInterface[] = message.result;
        setButtons(buttons);
        setSensors([]);
        break;
      case "SelectSensorHistoryResult":
        const sensorsArray: SensorInterface[] = JSON.parse(message.result);
        if (sensorsArray.length > 0) {
          const sensorName = sensorsArray[0].sensor_name;
          clearSensorsByName(sensorName);
          addSensors(sensorsArray);
        }
        break;
      case "SelectAllSensorInfoResultSrc":
        console.log("SelectAllSensorInfoSrc" + message.result);
        const allSensors: SensorInterface[] = JSON.parse(message.result);
        addSensors(allSensors);
        break;
      case "SensorReceived":
        const sensorDataReceived = message.value;
        updateSensor(sensorDataReceived);
        addHistory({
          button_name: message.value.sensor_name,
          date: message.value.date
            ? format(new Date(message.value.date), "dd/MM HH:mm")
            : format(new Date(), "dd/MM HH:mm"),
        });
        break;
      case "AlarmReceived":
        setButtonTriggered(message.btn_id, true);
        addHistory({
          button_name: "Alarm" + message.alarm,
          date: message.date
            ? format(new Date(message.date), "dd/MM HH:mm")
            : format(new Date(), "dd/MM HH:mm"),
        });
        toast({
          description: "Alarme Recebido" + message.alarm,
        });
        break;
      case "AlarmStopReceived":
        setStopButtonTriggered(message.alarm, false);
        addHistory({
          button_name: "Alarm Parou" + message.alarm,
          date: format(new Date(), "dd/MM HH:mm"),
        });
        break;
      case "DeleteButtonsSuccess":
        deleteButton(message.id_deleted);
        break;
      case "IncreaseButtons":
        const newButton: ButtonInterface = message.result;
        addButton(newButton);
        // toast({
        //   description: "Botão Criado com sucesso",
        // });
        break;
      case "UpdateButtonSuccess":
        const updatedButton: ButtonInterface = message.result;
        updateButton(updatedButton);

        break;
      // case "SelectSensorsResult":
      //   const result = message.result;
      //   const sensorData = result.map((gatewayData: any) => {
      //     const gateway_id = Object.keys(gatewayData); // Pegando o gateway_id
      //     // console.log("Gateway_ID" + gateway_id);
      //     // console.log("Devices " + JSON.stringify(gatewayData[1].devices));
      //     const devices = gatewayData[1].devices.map(
      //       (device: {
      //         name: string;
      //         description: string;
      //         devEUI: string;
      //       }) => ({
      //         name: device.name,
      //         description: device.description,
      //         devEUI: device.devEUI,
      //       })
      //     );

      //     return { gateway_id, devices };
      //   });

      //   addSensorName(sensorData);
      //   break;
      default:
        console.log("Unknown message type:", message);
        break;
    }
  };
  const handleAdminToggle = () => {
    updateAccount({ isAdmin: true });
    console.log("IsAdmin tem que ir para true " + account.isAdmin);
    navigate("/admin/buttons"); // Redireciona para a rota admin/buttons
  };

  const handleOptChange = (newOpt: string) => {
    setSelectedOpt(newOpt);
  };

  return (
    <WebSocketProvider
      token={account.accessToken}
      onMessage={handleWebSocketMessage}
    >
      <div className="flex gap-1 p-1">
        <LeftGrid buttons={buttons} selectedUser={account} />

        <ButtonsGridPage
          buttons={buttons}
          selectedUser={account}
          onOptChange={handleOptChange}
        />

        <RightGrid
          onKeyChange={handleOptChange}
          buttons={buttons}
          selectedUser={account}
          selectedOpt={selectedOpt}
        />
      </div>
      {account.type === "admin" && (
        <Button variant="ghost" onClick={handleAdminToggle}>
          {" "}
          Visão de admin
        </Button>
      )}
      <Logout />
    </WebSocketProvider>
  );
}

export default ValidadeToken(UserLayout);
