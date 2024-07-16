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
import { UserInterface, useUsers } from "@/components/user/UserContext";
import {
  ChatInterface,
  ChatProvider,
  useChat,
} from "@/components/chat/ChatContext";

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
  const { setUsers, updateUserStauts } = useUsers();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const {
    setButtons,
    setButtonTriggered,
    setStopButtonTriggered,
    addButton,
    deleteButton,
    updateButton,
    setCommandValue,
    buttons,
  } = useButtons();
  const {
    setSensors,
    updateSensor,
    replaceLatestSensor,
    clearSensorsByName,
    addSensors,
    addSensorName,
  } = useSensors();
  const { addHistory, updateHistory } = useHistory();
  const {
    setChat,
    allMessages,
    addChat,
    addChatMessage,
    chatDelivered,
    chatRead,
  } = useChat();
  const [selectedOpt, setSelectedOpt] = useState<string>("floor");
  const [clickedUser, setClickedUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
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
        const allSensors: SensorInterface[] = message.result;
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
        break;
      case "UpdateButtonSuccess":
        const updatedButton: ButtonInterface = message.result;
        updateButton(updatedButton);

        break;
      case "TableUsersResult":
        const newUser: UserInterface[] = message.result;
        setUsers(newUser);
        break;
      case "UserOnline":
        if (message.guid !== myAccountInfo.guid) {
          // nao atualizar o meu próprio status
          updateUserStauts(message.guid, "online");
        }
        break;
      case "UserOffline":
        if (message.guid !== myAccountInfo.guid) {
          // nao atualizar o meu próprio status
          updateUserStauts(message.guid, "offline");
        }
        break;
      case "Message": // mensagem do cara
        const newMsgFrom: ChatInterface = message.result[0];
        addChatMessage(newMsgFrom);
        break;
      case "MessageResult": // minha mensagem
        const newMsgTo: ChatInterface = message.result[0];
        addChat(newMsgTo);
        break;

      case "SelectMessageHistoryResultSrc":
        const allMsg: ChatInterface[] = message.result;
        allMessages(allMsg); // receber todas conversas
        break;
      case "ChatDelivered":
        const msg_id = message.result[0].id;
        const deliveredDate = message.result[0].delivered;
        chatDelivered(msg_id, deliveredDate);
        // atualizar que o usuario que eu estou conversando recebeu a mensagem
        break;
      case "ChatRead":
        const id_Read = message.result[0].id;
        const deliveredDate_Read = message.result[0].delivered;
        const readDate = message.result[0].read;
        chatRead(id_Read, deliveredDate_Read, readDate);
        // atualizar que o usuario que eu estou conversando leu e recebeu a mensagem
        break;
      case "ControllerReceived":
        const commandBtn_id = message.btn_id;
        const commandPrt = message.prt;
        const commandValue = message.value;
        setCommandValue(commandBtn_id, commandPrt, commandValue);
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

  const handleClickedUser = (newUser: string | null) => {
    setClickedUser(newUser);
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
          clickedUser={clickedUser}
        />

        <RightGrid
          onKeyChange={handleOptChange}
          buttons={buttons}
          selectedUser={account}
          selectedOpt={selectedOpt}
          clickedUser={clickedUser}
          setClickedUser={handleClickedUser}
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
