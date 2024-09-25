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
import { FullScreenButton } from "@/components/FullScreanButton";

import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
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
import InteractiveGridCopy from "@/components/optBar/InteractiveGridCopy";
import {
  UserPbxInterface,
  useUsersPbx,
} from "@/components/users/usersPbx/UsersPbxContext";
import { useCalls } from "@/components/calls/CallContext";
import Loader from "@/components/Loader";
import HeaderUser from "@/components/header/HeaderUser";
import {
  NotificationsInterface,
  useAppConfig,
} from "@/components/options/ConfigContext";
import SoundPlayer from "@/components/soundPlayer/SoundPlayer";
import bleep from "@/assets/sounds/bleep.wav";
import mobile from "@/assets/sounds/mobile.wav";
import { checkButtonWarning } from "@/components/utils/utilityFunctions";
interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

function UserLayout() {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(true);
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
    setHeldCall,
    setHeldCallByUser,
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
    buttonSensors,
  } = useSensors();
  const { setUsersPbx } = useUsersPbx();
  const { updateUserStauts } = useUsers();
  const { history, addHistory } = useHistory();
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
  const {
    addCall,
    addIncomingCall,
    removeIncomingCall,
    removeCall,
    setHeldIncomingCall,
    setHeldIncomingCallByUser,
  } = useCalls();
  const [selectedOptTop, setSelectedOptTop] = useState<string>("floor"); // default for top
  const [clickedUserTop, setClickedUserTop] = useState<string | null>(null);
  const [selectedOptBottom, setSelectedOptBottom] = useState<string>("floor"); // default for bottom
  const [clickedUserBottom, setClickedUserBottom] = useState<string | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const { setApiKeyInfo, addNotifications } = useAppConfig();
  //const [clickedUser , setClickedUser] = useState<UserInterface[]>([])
  const navigate = useNavigate();
  const { guid } = useContext(AccountContext);
  const [comboStart, setComboStart] = useState(false);
  const { users } = useUsers();
  const [playNotificationSound, setPlayNotificationSound] = useState(false); // som para notificação
  const [playCallSound, setPlayCallSound] = useState(false); //som para chamada

  const isAllowedButtonType = (type: string) => {
    const allowedTypes = [
      "floor",
      "maps",
      "video",
      "chat",
      "sensor",
      "camera",
      "radio",
      "call",
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
        setIsLoading(false);
        break;
      case "SensorReceived":
        const sensorDataReceived = message.value;
        updateSensorButton(sensorDataReceived);
        updateGraphSensor(sensorDataReceived);
        break;
      case "addThresholdNotification":
        //tratar a notificação sonora aqui
        break;
      case "delThresholdNotification":
        //tratar a notificação sonora aqui
        break;
      case "AlarmReceived":
        setButtonTriggered(message.btn_id, true);
        const userStartAlarm = allUsers.filter((user) => {
          return user.guid === message.src;
        })[0];
        // addHistory({
        //   id: "",
        //   guid: "",
        //   from: "",
        //   name: "TESTE",
        //   date: message.date
        //     ? format(new Date(message.date), "dd/MM HH:mm")
        //     : format(new Date(), "dd/MM HH:mm"),

        //   status: "",
        //   prt: "",
        //   details: "",
        // });
        // setPlayNotificationSound(true); // Toca o som de notificação
        // setTimeout(() => setPlayNotificationSound(false), 500);
        break;
      case "AlarmStopReceived":
        setStopButtonTriggered(message.alarm, false);
        const userStopAlarm = allUsers.filter((user) => {
          return user.guid === message.src;
        })[0];
        // addHistory({
        //   date: message.date
        //     ? format(new Date(message.date), "dd/MM HH:mm")
        //     : format(new Date(), "dd/MM HH:mm"),
        //   message: `${userStopAlarm?.name} parou o alarme ${message.alarm}`,
        //   type: "alarm",
        // });
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
            const {
              btn_id,
              call_started,
              call_connected,
              direction,
              call_innovaphone,
              number,
              device,
              deviceText,
            } = call;

            if (call_connected) {
              const callStartTime = new Date(call_started).getTime();
              const now = Date.now();
              const elapsedTime = Math.floor((now - callStartTime) / 1000);

              setSelectedOptBottom("call");
              if (btn_id) {
                setButtonClickedStatus(
                  btn_id,
                  "callInCurse",
                  "bg-red-900",
                  true
                );
                const button = allBtn.find((btn) => btn.id === btn_id);
                if (button) {
                  console.log(`Adding call for button: ${button.button_name}`);
                  addCall(button, elapsedTime);
                } else {
                  console.log(`Button not found for btn_id: ${btn_id}`);
                }
              } else if (!btn_id && direction === "inc") {
                const incomingCallsInCurseConnected = {
                  id: call_innovaphone,
                  device: device,
                  deviceText: deviceText,
                  num: number,
                  callId: String(call_innovaphone),
                  connected: true,
                };
                addIncomingCall(incomingCallsInCurseConnected, elapsedTime);
              }
            } else if (!call_connected && !btn_id && direction === "inc") {
              const incomingCallsInCurseRinging = {
                id: call_innovaphone,
                device: device,
                deviceText: deviceText,
                num: number,
                callId: String(call_innovaphone),
                connected: false,
              };
              setSelectedOptBottom("call");
              addIncomingCall(incomingCallsInCurseRinging);
            }
          });
        }
        break;
      case "ConnRemovedByAdmin":
        const currentSession = localStorage.getItem("currentSession");
        localStorage.removeItem(currentSession as string);
        localStorage.removeItem("currentSession");
        navigate("/login");
        localStorage.setItem("disconnected", message.from);

        break;
      case "IncomingCallRing":
        //    {"api":"user","mt":"IncomingCallRing","device":"Softphone","num":"1015","call":32}
        //  {api: 'user', mt: 'IncomingCallRing', device: 'IP 112', num: '1015', call: 30}
        const incomingCallRing = {
          id: message.call,
          device: message.device,
          deviceText: message.deviceText,
          num: message.num,
          callId: String(message.call),
          connected: false,
        };
        addIncomingCall(incomingCallRing);
        // setPlayCallSound(true);
        setSelectedOptBottom("call");
        break;
      case "IncomingCallConnected":
        const incomingCallConnected = {
          id: message.call,
          device: message.device,
          deviceText: message.deviceText,
          num: message.num,
          callId: String(message.call),
          connected: true,
        };
        addIncomingCall(incomingCallConnected);
        setSelectedOptBottom("call");
        break;
      case "IncomingCallDisconnected":
        removeIncomingCall(String(message.call));
        // setPlayCallSound(false);
        break;
      case "CallRinging":
        setButtonClickedStatus(message.btn_id, "callRinging", "bg-orange-700");
        break;
      case "CallConnected":
        setSelectedOptBottom("call");
        setButtonClickedStatus(
          message.btn_id,
          "callConnected",
          "bg-red-900",
          true
        );
        break;
      case "CallHeld":
        // usuario me colocou em espera
        if (message.btn_id !== "") {
          console.log("Chamada que eu realizei");
          setButtonClickedStatus(
            message.btn_id,
            "callHeld",
            "bg-purple-900",
            true
          );
          setHeldCallByUser(message.btn_id, true);
        } else {
          console.log("Chamada que eu recebi");
          setHeldIncomingCallByUser(String(message.call), true);
        }
        break;
      case "CallRetrieved":
        if (message.btn_id !== "") {
          setButtonClickedStatus(
            message.btn_id,
            "callRetrieved",
            "bg-red-900",
            true
          );
          setHeldCallByUser(message.btn_id, false);
        } else {
          console.log("Chamada que eu recebi");
          setHeldIncomingCallByUser(String(message.call), false);
        }
        // usuario retomou a chamada
        break;
      case "UserCallRetrieved":
        if (message.btn_id !== "") {
          console.log("Chamada que eu realizei");
          setButtonClickedStatus(
            message.btn_id,
            "userCallRetrieved",
            "bg-red-900",
            true
          );
          setHeldCall(message.btn_id, false);
        } else {
          setHeldIncomingCall(String(message.call), false);
        }
        // eu retomei a chamada
        break;
      case "UserCallHeld":
        if (message.btn_id !== "") {
          console.log("Chamada que eu realizei");
          setButtonClickedStatus(
            message.btn_id,
            "userCallHeld",
            "!bg-blue-800",
            true
          );
          setHeldCall(message.btn_id, true);
        } else {
          setHeldIncomingCall(String(message.call), true);
        }
        //eu coloquei em espera
        break;
      case "CallDisconnected":
        setButtonClickedStatus(message.btn_id, "callDisconnected", "", false);
        removeCall(message.btn_id);
        break;
      case "NumberOnline":
        setButtonNumberCallStatus(
          message.number,
          message.color,
          "bg-green-600",
          message.note
        );
        break;
      case "NumberBusy":
        if (message.color === "ringing") {
          setButtonNumberCallStatus(
            message.number,
            message.color,
            "bg-orange-500",
            message.note
          );
          return;
        }
        setButtonNumberCallStatus(
          message.number,
          message.color,
          "bg-red-900",
          message.note
        );

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
        const userMsg = allUsers.filter((user) => {
          return user.guid === message.result[0].from_guid;
        })[0];
        // addHistory({
        //   date: message.result[0].date
        //     ? format(new Date(message.result[0].date), "dd/MM HH:mm")
        //     : format(new Date(), "dd/MM HH:mm"),
        //   message: `Mensagem recebida de ${userMsg?.name}`,
        //   type: "msg",
        // });
        setPlayNotificationSound(true); // Toca o som de notificação
        setTimeout(() => setPlayNotificationSound(false), 500);
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
        const apiKeyEntries = message.result.filter(
          (item: any) => item.entry === "googleApiKey"
        );
        const sensorNotification = message.result.find(
          (item: NotificationsInterface) => item.entry === "sensorNotification"
        );
        const alarmNotification = message.result.find(
          (item: NotificationsInterface) => item.entry === "alarmNotification"
        );
        const chatNotification = message.result.find(
          (item: NotificationsInterface) => item.entry === "chatNotification"
        );
        const soundsInfo = [
          ...(sensorNotification ? [sensorNotification] : []),
          ...(alarmNotification ? [alarmNotification] : []),
          ...(chatNotification ? [chatNotification] : []),
        ];

        soundsInfo.forEach((sound) => addNotifications(sound));
        setApiKeyInfo(apiKeyEntries);

        break;

      case "ComboStartButton":
        comboStarted(message.btn_id);
        const comboButtons = allBtn?.filter((btn) => {
          return btn.id === message.btn_id;
        })[0];

        if (comboButtons) {
          if (comboButtons.position_y === "1") {
            if (isAllowedButtonType(message.type)) {
              setSelectedOptTop(
                message.type === "camera" ? "sensor" : message.type
              );
              //nao existe opt camera , entao se o botão for do tipo camera colocamos a opt Sensor
            }
          } else if (comboButtons.position_y === "2") {
            if (isAllowedButtonType(message.type)) {
              setSelectedOptBottom(
                message.type === "camera" ? "sensor" : message.type
              );
              //nao existe opt camera , entao se o botão for do tipo camera colocamos a opt Sensor
              console.log(
                "OptBottom" + selectedOptBottom + "OptTop" + selectedOptTop
              );
            }
          }
        }
        break;
      case "SmartButtonReceived":
        setButtonTriggered(message.btn_id, true);
        // addHistory({
        //   date: message.date
        //     ? format(new Date(message.date), "dd/MM HH:mm")
        //     : format(new Date(), "dd/MM HH:mm"),
        //   type: "sensor",
        //   message: "Botão Vermelho Disparou",
        // });
        toast({
          description: "Botão Vermelho Disparou",
        });
        break;
      case "TriggerStopAlarmResult":
        setButtonTriggered(message.btn_id, false);
        break;
      case "getHistoryResult":
        const historyArray = message.result;
        historyArray.forEach((hist: any) => {
          addHistory(hist);
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
    <>
      <WebSocketProvider
        token={account.accessToken}
        onMessage={handleWebSocketMessage}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-center items-center min-h-screen">
              <div className="">
                <div className="flex gap-1">
                  <div className="gap-1 space-y-1">
                    <InteractiveGridCopy
                      interactive="top"
                      onKeyChange={handleOptChangeTop}
                      buttons={buttons}
                      selectedUser={account as any}
                      selectedOpt={selectedOptTop}
                      clickedUser={clickedUserTop}
                      setClickedUser={handleClickedUserTop}
                    />
                    <InteractiveGridCopy
                      interactive="bottom"
                      onKeyChange={handleOptChangeBottom}
                      buttons={buttons}
                      selectedUser={account as any}
                      selectedOpt={selectedOptBottom}
                      clickedUser={clickedUserBottom}
                      setClickedUser={handleClickedUserBottom}
                    />
                  </div>

                  <ButtonsGridPage
                    buttonsGrid={buttons}
                    selectedUser={account as any}
                    // selectedOpt={selectedOpt}
                    // onOptChange={handleOptChange}
                    // clickedUser={clickedUser}
                  />
                </div>
                <HeaderUser />
              </div>
            </div>
          </>
        )}
      </WebSocketProvider>
      {/* soundPlayer para Notificações Gerais */}
      <SoundPlayer soundSrc={mobile} play={playNotificationSound} />
      {/* soundPlayer para Chamadas
      <SoundPlayer soundSrc={mobile} play={playCallSound} /> */}
    </>
  );
}

export default ValidadeToken(UserLayout);
