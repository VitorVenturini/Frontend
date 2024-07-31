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
import { Ghost } from "lucide-react";
import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useHistory } from "@/components/history/HistoryContext";
import { useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { UserInterface, useUsers } from "@/components/user/UserContext";
import {
  ChatInterface,
  ChatProvider,
  useChat,
} from "@/components/chat/ChatContext";
import { useGoogleApiKey } from "@/components/options/ApiGoogle/GooglApiContext";
import InteractiveGrid from "@/components/Interactive/InteractiveGrid";

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
    comboStarted,
    buttons,
  } = useButtons();
  const { setSensors, updateSensor, clearSensorsByName, addSensors } =
    useSensors();
  const { addHistory, updateHistory } = useHistory();
  const { setApiKeyInfo } = useGoogleApiKey();
  const {
    setChat,
    allMessages,
    addChat,
    addChatMessage,
    chatDelivered,
    chatRead,
  } = useChat();
  const [selectedOptTop, setSelectedOptTop] = useState<string>("floor"); // default for top
  const [clickedUserTop, setClickedUserTop] = useState<string | null>(null);
  const [selectedOptBottom, setSelectedOptBottom] = useState<string>("floor"); // default for bottom
  const [clickedUserBottom, setClickedUserBottom] = useState<string | null>(
    null
  );

  const navigate = useNavigate();
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");
  const [comboStart, setComboStart] = useState(false);

  const isAllowedButtonType = (type: string) => {
    const allowedTypes = ["floor", "maps", "video", "chat", "sensor", "radio"];
    return allowedTypes.includes(type);
  };

  // useEffect(() => {
  //   if (buttons) {
  //     buttons.forEach((btn) =>{
  //       if(btn.comboStart && isAllowedButtonType(btn.button_type)){
  //         setSelectedOpt(btn.button_type);
  //       }
  //     })
  //   }
  // }, [comboStart]);

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const buttons: ButtonInterface[] = message.result;
        setButtons(buttons);
        setSensors([]);
        break;
      case "SelectDeviceHistoryResult":
        const sensorsArray: SensorInterface[] = JSON.parse(message.result);
        if (sensorsArray.length > 0) {
          const sensorName = sensorsArray[0].sensor_name;
          clearSensorsByName(sensorName);
          addSensors(sensorsArray);
        }
        break;
      case "ImageReceived":
        const camArray: SensorInterface[] = message.result;
        addSensors(camArray);
        break;
      case "SelectAllSensorInfoResultSrc":
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
      case "ConfigResult":
        setApiKeyInfo(message.result);
        break;
      // case "ComboStartButton":
      //   comboStarted(message.btn_id);
      //   if (isAllowedButtonType(message.type)) {
      //     setSelectedOpt(message.type);
      //   }

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

  const handleOptChangeTop = (newOpt: string) => {
    setSelectedOptTop(newOpt);
  };

  const handleClickedUserTop = (newUser: string | null) => {
    setClickedUserTop(newUser);
  };

  const handleOptChangeBottom = (newOpt: string) => {
    setSelectedOptBottom(newOpt);
  };

  const handleClickedUserBottom = (newUser: string | null) => {
    setClickedUserBottom(newUser);
  };

  return (
    <WebSocketProvider
      token={account.accessToken}
      onMessage={handleWebSocketMessage}
    >
      <div className="flex justify-center gap-1 p-1">
        <div className="gap-1 space-y-1">
          {/* DE CIMA  */}
          <InteractiveGrid
            interactive="top"
            onKeyChange={handleOptChangeTop}
            buttons={buttons}
            selectedUser={account}
            selectedOpt={selectedOptTop}
            clickedUser={clickedUserTop}
            setClickedUser={handleClickedUserTop}
          />
            {/* DE BAIXO  */}
          <InteractiveGrid
            interactive="bottom"
            onKeyChange={handleOptChangeBottom}
            buttons={buttons}
            selectedUser={account}
            selectedOpt={selectedOptBottom}
            clickedUser={clickedUserBottom}
            setClickedUser={handleClickedUserBottom}
          /> 
        </div>

        <ButtonsGridPage
          buttons={buttons}
          selectedUser={account}
          // selectedOpt={selectedOpt}
          // onOptChange={handleOptChange}
          // clickedUser={clickedUser}
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
