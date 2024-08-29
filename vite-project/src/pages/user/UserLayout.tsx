import { Routes, Route, useNavigate } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import LogoCore from "../../assets/LogoCore.svg";
import {
  AccountContext,
  useAccount,
} from "@/components/account/AccountContext";
import { Button } from "@/components/ui/button";
import { ReactElement, useContext, useState } from "react";

import Logout from "@/components/logout/Logout";
import { WebSocketProvider } from "@/components/websocket/WebSocketProvider";
import ButtonsGridPage from "@/components/buttons/buttonsGrid/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/buttons/buttonContext/ButtonsContext";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import LeftGrid from "@/components/leftGrid/LeftGrid";
import { Ghost, Pause, Phone, User } from "lucide-react";
import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useHistory } from "@/components/history/HistoryContext";
import { useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  UserInterface,
  useUsers,
} from "@/components/users/usersCore/UserContext";
import {
  ChatInterface,
  ChatProvider,
  useChat,
} from "@/components/chat/ChatContext";
import { useGoogleApiKey } from "@/components/options/ApiGoogle/GooglApiContext";
import InteractiveGridCopy from "@/components/optBar/InteractiveGridCopy";
import {
  UserPbxInterface,
  useUsersPbx,
} from "@/components/users/usersPbx/UsersPbxContext";
import { PbxInterface } from "@/components/options/Pbx/PbxContext";
import { useCalls } from "@/components/calls/CallContext";

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
  const { setUsers } = useUsers();
  const { updateUserPbxStauts } = useUsersPbx();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const {
    setButtons,
    setButtonTriggered,
    setButtonClickedStatus,
    setButtonNumberCallStatus,
    setStopButtonTriggered,
    addButton,
    deleteButton,
    updateButton,
    setCommandValue,
    comboStarted,
    buttons,
  } = useButtons();
  const {
    setSensors,
    updateSensorButton,
    updateGraphSensor,
    clearSensorsByEUI,
    clearCamByEUI,
    addSensors,
    addImages,
    addSensorsButton,
    updateGalleryImages,
  } = useSensors();
  const { setUsersPbx } = useUsersPbx();
  const { updateUserStauts } = useUsers();
  const { addHistory } = useHistory();
  const { setApiKeyInfo } = useGoogleApiKey();
  const {
    setChat,
    allMessages,
    addLastestMessage,
    addChat,
    addChatMessage,
    chatDelivered,
    chatRead,
    clearChat,
  } = useChat();
  const { addCall } = useCalls();
  const [selectedOptTop, setSelectedOptTop] = useState<string>("floor"); // default for top
  const [clickedUserTop, setClickedUserTop] = useState<string | null>(null);
  const [selectedOptBottom, setSelectedOptBottom] = useState<string>("floor"); // default for bottom
  const [clickedUserBottom, setClickedUserBottom] = useState<string | null>(
    null
  );
  //const [clickedUser , setClickedUser] = useState<UserInterface[]>([])

  const navigate = useNavigate();
  const { guid } = useContext(AccountContext);
  const [comboStart, setComboStart] = useState(false);
  const { users } = useUsers();

  const isAllowedButtonType = (type: string) => {
    const allowedTypes = [
      "floor",
      "maps",
      "video",
      "chat",
      "sensor",
      "camera",
      "radio",
    ];
    return allowedTypes.includes(type);
  };
  var allBtn: ButtonInterface[];
  var allUsers: UserInterface[];
  var pbxUser: UserPbxInterface[];
  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const buttons: ButtonInterface[] = message.result;
        setButtons(buttons);
        allBtn = buttons;
        setSensors([]);
        break;
      case "SelectAllMessagesSrcResult":
        const latestMessage = JSON.parse(message.result);
        clearChat();
        // latestMessage.forEach((chat: ChatInterface) => addLastestMessage(chat));
        addLastestMessage(latestMessage); // info dos chats para ser exibido no chat list
        break;
      case "SelectMessageHistoryResultSrc":
        const allMsg: ChatInterface[] = message.result;
        console.log("MyGuid" + guid);
        allMessages(allMsg, guid); // receber todas conversas
        break;

      case "SelectDeviceHistoryResult":
        const sensorsArray: SensorInterface[] = JSON.parse(message.result);
        if (sensorsArray.length > 0) {
          const sensorEUI = sensorsArray[0].deveui;
          if (!sensorsArray[0].image || sensorsArray[0].image === null) {
            // quando nao for camera
            clearSensorsByEUI(sensorEUI as string); // limpa todas infos do sensor
            addSensors(sensorsArray); //adiciona novas infos
          } else {
            // quando for camera
            clearCamByEUI(sensorEUI as string); // limpa todas infos do sensor
            addImages(sensorsArray); //adiciona novas infos
          }
        }
        break;
      case "ImageReceived":
        const camArray: SensorInterface[] = message.result;
        camArray.forEach((image) => updateGalleryImages(image));
        break;
      case "SelectAllSensorInfoResultSrc":
        const allSensors = JSON.parse(message.result);
        // allSensors.forEach((sensor: SensorInterface) => updateSensorButton(sensor));
        addSensorsButton(allSensors); // info dos sensores para ser exibido nos botões
        break;
      case "SensorReceived":
        const sensorDataReceived = message.value;
        updateSensorButton(sensorDataReceived);
        updateGraphSensor(sensorDataReceived);
        break;
      case "AlarmReceived":
        setButtonTriggered(message.btn_id, true);
        const userStartAlarm = allUsers.filter((user) => {
          return user.guid === message.src;
        })[0];
        addHistory({
          date: message.date
            ? format(new Date(message.date), "dd/MM HH:mm")
            : format(new Date(), "dd/MM HH:mm"),
          message: `${userStartAlarm?.name} disparou o alarme ${message.alarm}`,
        });
        toast({
          description: "Alarme Recebido" + message.alarm,
        });
        break;
      case "AlarmStopReceived":
        setStopButtonTriggered(message.alarm, false);
        const userStopAlarm = allUsers.filter((user) => {
          return user.guid === message.src;
        })[0];
        addHistory({
          date: message.date
            ? format(new Date(message.date), "dd/MM HH:mm")
            : format(new Date(), "dd/MM HH:mm"),
          message: `${userStopAlarm?.name} parou o alarme ${message.alarm}`,
        });
        toast({
          description: "Alarme Parou " + message.alarm,
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
        allUsers = newUser;
        setUsers(newUser);
        break;
      case "PbxTableUsersResult":
        const PbxUsers: UserPbxInterface[] = message.result;
        setUsersPbx(PbxUsers);
        pbxUser = PbxUsers;
        break;
      case "CallsInCurse":
        const callsInCurse = message.result;
        console.log("CallsInCurse received:", callsInCurse.length);
        if (callsInCurse.length > 0) {
          callsInCurse.forEach((call: any) => {
            const { btn_id, call_started } = call;
            console.log(`Processing call for btn_id: ${btn_id}`);
            // Calcular a duração da chamada em andamento
            const callStartTime = new Date(call_started).getTime();
            const now = Date.now();
            const elapsedTime = Math.floor((now - callStartTime) / 1000);

            // Atualizar o botão correspondente com o status da chamada
            setSelectedOptBottom("call");
            setButtonClickedStatus(btn_id, "callInCurse", true);

            // Adicionar a chamada ao contexto de chamadas com a duração calculada
            const button = allBtn.find((btn) => btn.id === btn_id);
            if (button) {
              console.log(`Adding call for button: ${button.button_name}`);
              addCall(button, elapsedTime);
            } else {
              console.log(`Button not found for btn_id: ${btn_id}`);
            }
          });
        }

        break;
      case "ConnRemovedByAdmin":
        const currentSession = localStorage.getItem("currentSession");
        localStorage.removeItem(currentSession as string)
        localStorage.removeItem("currentSession")
        navigate("/login");
        // message.from
        break;
      case "CallRinging":
        setButtonClickedStatus(message.btn_id, "callRinging");
        break;
      case "CallConnected":
        setSelectedOptBottom("call");
        setButtonClickedStatus(message.btn_id, "callConnected", true);
        break;
      case "CallHeld":
        setButtonClickedStatus(message.btn_id, "callHeld", true);
        // usuario me colocou em espera
        break;
      case "CallRetrieved":
        setButtonClickedStatus(message.btn_id, "callRetrieved", true);
        // usuario retomou a chamada
        break;
      case "UserCallRetrieved":
        setButtonClickedStatus(message.btn_id, "userCallRetrieved", true);
        // eu retomei a chamada
        break;
      case "UserCallHeld":
        setButtonClickedStatus(message.btn_id, "userCallHeld", true);
        //eu coloquei em espera
        break;
      case "CallDisconnected":
        setButtonClickedStatus(message.btn_id, "callDisconnected", false);
        break;
      case "NumberOnline":
        setButtonNumberCallStatus(message.number, message.color, message.note);
        break;
      case "NumberBusy":
        setButtonNumberCallStatus(message.number, message.color, message.note);
        break;
      case "CoreUserOnline":
        updateUserStauts(message.guid, "online");
        break;
      case "CoreUserOffline":
        updateUserStauts(message.guid, "offline");
        break;
      case "UserOnline":
        if (pbxUser?.length > 0) {
          updateUserPbxStauts(message.guid, message.color, message.note);
        }
        break;
      case "UserOffline":
        if (pbxUser?.length > 0) {
          updateUserPbxStauts(message.guid, "offline", "offline");
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
      case "ComboStartButton":
        comboStarted(message.btn_id);
        const comboButtons = allBtn?.filter((btn) => {
          return btn.id === message.btn_id;
        })[0];

        if (comboButtons) {
          if (comboButtons.position_y === "1") {
            if (isAllowedButtonType(message.type)) {
              setSelectedOptTop(message.type);
            }
          } else if (comboButtons.position_y === "2") {
            if (isAllowedButtonType(message.type)) {
              setSelectedOptBottom(message.type);
            }
          }
        }
        break;
      case "SmartButtonReceived":
        setButtonTriggered(message.btn_id, true);
        // addHistory({
        //   button_name: "Alarm" + message.alarm,
        //   date: message.date
        //     ? format(new Date(message.date), "dd/MM HH:mm")
        //     : format(new Date(), "dd/MM HH:mm"),
        // });
        toast({
          description: "Botão Vermelho Disparou",
        });
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
          <InteractiveGridCopy
            interactive="top"
            onKeyChange={handleOptChangeTop}
            buttons={buttons}
            selectedUser={account}
            selectedOpt={selectedOptTop}
            clickedUser={clickedUserTop}
            setClickedUser={handleClickedUserTop}
          />
          {/* DE BAIXO  */}
          <InteractiveGridCopy
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
          buttonsGrid={buttons}
          selectedUser={account}
          // selectedOpt={selectedOpt}
          // onOptChange={handleOptChange}
          // clickedUser={clickedUser}
        />
      </div>
      <div className="flex gap-5">
        {account.type === "admin" && (
          <Button variant="ghost" onClick={handleAdminToggle}>
            {" "}
            <img src={LogoCore} alt="Logo" className="h-8" />
          </Button>
        )}
        <Logout />
      </div>

      {/*   <div className="text-[9px] sm:text-[15px] md:text-[20px] lg:text-[22px] xl:text-[35px] 2xl:text-[50px] ">
        VE O TAMANHO AQUI O ANIMAL até o lg é tablet dps de 1290 xl é desktop
      </div> */}
    </WebSocketProvider>
  );
}

export default ValidadeToken(UserLayout);
