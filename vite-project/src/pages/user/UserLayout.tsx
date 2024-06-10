import { Routes, Route, useNavigate } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { AccountContext, useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Logout from "@/components/Logout";
import useWebSocket from "@/components/useWebSocket";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import ButtonsGridPage from "@/components/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/ButtonsContext";

import LeftGrid from "@/components/LeftGrid";
import RightGrid from "@/components/RightGrid";
import { Ghost } from "lucide-react";
import { SensorInterface, useSensors } from "@/components/SensorContext";
import { useWebSocketData } from "@/components/WebSocketProvider";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

function UserLayout() {
  const account = useAccount();
  const { updateAccount } = useAccount();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const { setButtons, buttons } = useButtons();
  const { setSensors, updateSensor, clearSensors } = useSensors();
  const [selectedOpt, setSelectedOpt] = useState<string>("floor");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState("");
  const wss = useWebSocketData();

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const buttons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(buttons);
        //clearSensors();
        // setSensors([])
        break;
      case "SelectSensorHistoryResult":
        const sensors: SensorInterface[] = JSON.parse(message.result);
        sensors.forEach((sensor) => updateSensor(sensor)); // Atualizar sensores individualmente
        break;
      case "SelectSensorInfoResultSrc":
        console.log("SelectSensorInfoResultSrc + \n Result" + message.result + " Nome do Sensor " + message.sensor_name);
        // const sensorData = JSON.parse(message.result);
        // updateSensor({
        //   sensor_name: message.sensor_name,
        //   ...sensorData
        // });
        break;
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
        <div>
          <ButtonsGridPage
            buttons={buttons}
            selectedUser={account}
            onOptChange={handleOptChange}
          />
        </div>
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
