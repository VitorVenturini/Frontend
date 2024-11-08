import { Routes, Route, useNavigate } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import LogoCore from "../../assets/LogoCore.svg";
import {
  AccountContext,
  useAccount,
} from "@/components/account/AccountContext";
import { Button } from "@/components/ui/button";
import React, { ReactElement, useContext, useState } from "react";

import Logout from "@/components/logout/Logout";
import { WebSocketProvider } from "@/components/websocket/WebSocketProvider";
import ButtonsGridPage from "@/components/buttons/buttonsGrid/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/buttons/buttonContext/ButtonsContext";

import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
import { useHistory } from "@/components/history/HistoryContext";

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
import { useRef } from "react";
import { CallsInterface, useCalls } from "@/components/calls/CallContext";
import Loader from "@/components/Loader";
import HeaderUser from "@/components/header/HeaderUser";
import {
  NotificationsInterface,
  useAppConfig,
} from "@/components/options/ConfigContext";
import SoundPlayer from "@/components/soundPlayer/SoundPlayer";

import bleep from "@/assets/sounds/bleep.wav";
import mobile from "@/assets/sounds/mobile.wav";
import suspiciou from "@/assets/sounds/suspiciou.wav";
import minor from "@/assets/sounds/minor.wav";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect"; // Detectar se é um dispositivo móvel
import {
  setBusyLightColor,
  stopBusyLightColor,
} from "@/components/api/ApiFunctions";
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
  const { setUsersPbx, updateUserDevices } = useUsersPbx();
  const { updateUserStauts } = useUsers();
  const { history, addHistory, setHistoryComplete } = useHistory();
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
  const { addCall, updateCall, removeCall, calls } = useCalls();
  const [selectedOptTop, setSelectedOptTop] = useState<string>("floor"); // default for top
  const [clickedUserTop, setClickedUserTop] = useState<string | null>(null);
  const clickedUserTopRef = useRef<string | null>(null);
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
  const { users, setUserPreferences } = useUsers();
  const [sensorNotificationSound, setSensorNotificationSound] = useState("");
  const [chatNotificationSound, setChatNotificationSound] = useState("");
  const [alarmNotificationSound, setAlarmNotificationSound] = useState("");

  const [playNotificationSoundAlarm, setPlayNotificationSoundAlarm] =
    useState(false); // tocar o som
  const [playNotificationSoundChat, setPlayNotificationSoundChat] =
    useState(false); // tocar o som
  const [playNotificationSoundSensor, setPlayNotificationSoundSensor] =
    useState(false); // tocar o som

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

  const soundFiles = {
    bleep: bleep,
    mobile: mobile,
    minor: minor,
    suspiciou: suspiciou,
  };
  // Função para verificar se o som existe, caso contrário, retorna um valor padrão
  const getSoundSrc = (notificationSound: string) => {
    const soundSrc = soundFiles[notificationSound as keyof typeof soundFiles];
    if (soundSrc) {
      return soundSrc;
    }
  };

  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectUserPreferencesResult":
        if (message.result && message.result[0]) {
          setUserPreferences({
            guid: message.result[0].guid,
            page1: message.result[0].page1 || "",
            page2: message.result[0].page2 || "",
            page3: message.result[0].page3 || "",
            page4: message.result[0].page4 || "",
            page5: message.result[0].page5 || "",
          });
        }
        break;
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
        setSensors(allSensors); // setar todos os sensores para manipularmos no app todo
        // allSensors.forEach((sensor: SensorInterface) => updateSensorButton(sensor));
        addSensorsButton(allSensors); // info dos sensores para ser exibido nos botões
        setIsLoading(false);
        break;
      case "SensorReceived":
        const sensorDataReceived = message.value;
        updateSensorButton(sensorDataReceived);
        updateGraphSensor(sensorDataReceived);
        break;
      case "ButtonRequest":
        comboStarted(message.btn_id);
        const ButtonRequest = allBtn?.filter((btn) => {
          return btn.id === message.btn_id;
        })[0];
        console.log("BUTTONREQUEST " + JSON.stringify(ButtonRequest));
        if (ButtonRequest) {
          if (ButtonRequest.position_y === "1") {
            if (isAllowedButtonType(message.type)) {
              setSelectedOptTop(
                message.type === "camera" ? "sensor" : message.type
              );
              //nao existe opt camera , entao se o botão for do tipo camera colocamos a opt Sensor
            }
          } else if (ButtonRequest.position_y === "2") {
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
      case "AlarmReceived":
        const filteredBtn = allBtn.filter((btn) => {
          return btn.id === message.btn_id;
        })[0];
        setButtonTriggered(message.btn_id, true);
        if (!filteredBtn?.muted && filteredBtn?.button_type === "sensor") {
          setBusyLightColor();
          setTimeout(() => setPlayNotificationSoundSensor(true), 1500);
          setTimeout(() => setPlayNotificationSoundSensor(false), 2000);
        } else if (filteredBtn?.button_type === "alarm") {
          setBusyLightColor();
          setTimeout(() => setPlayNotificationSoundAlarm(true), 1500);
          setTimeout(() => setPlayNotificationSoundAlarm(false), 2000);
        }
        // colocar cor na busy light
        break;
      case "AlarmStopReceived":
        setStopButtonTriggered(message.alarm, false); // caso o usuário tenha mais de 1 botão com o mesmo código de alarme
        setButtonTriggered(message.btn_id, false);
        // desativa a cor na busy light
        stopBusyLightColor();
        break;
      case "DeleteButtonsSuccess":
        deleteButton(message.id_deleted);
        break;
      case "IncreaseButtons":
        const newButton: ButtonInterface = message.result;
        allBtn.push(newButton);
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
      case "ConnRemovedByAdmin":
        const currentSession = localStorage.getItem("currentSession");
        localStorage.removeItem(currentSession as string);
        localStorage.removeItem("currentSession");
        navigate("/login");
        localStorage.setItem("disconnected", message.from);
        break;

      case "CallsInCurse":
        const callsInCurse = message.result;
        console.log("CallsInCurse received:", callsInCurse.length);
        if (callsInCurse.length > 0) {
          callsInCurse.forEach((call: any) => {
            const {
              btn_id,
              call_started,
              call_ringing,
              call_connected,
              direction,
              call_innovaphone,
              number,
              device,
              deviceText,
            } = call;

            if (call_connected) {
              const callStartTime = new Date(call_started).getTime();

              setSelectedOptBottom("call");
              if (btn_id) {
                setButtonClickedStatus(
                  btn_id,
                  "callInCurse",
                  "bg-red-900",
                  false,
                  true,
                  true
                );
                const buttonCallInCurse: CallsInterface = {
                  callId: parseInt(call_innovaphone),
                  num: number as string,
                  type: "buttonCall",
                  connected: true,
                  ringing: false,
                  startTime: callStartTime,
                  held: false,
                  heldByUser: false,
                  device: device,
                  btn_id: btn_id,
                };
                addCall(buttonCallInCurse);
              } else if (!btn_id && direction === "inc") {
                const incomingCallsInCurseConnected: CallsInterface = {
                  callId: parseInt(call_innovaphone),
                  num: number as string,
                  type: "incoming",
                  connected: true,
                  ringing: false,
                  startTime: callStartTime,
                  held: false,
                  heldByUser: false,
                  device: device,
                  deviceText: deviceText,
                };
                addCall(incomingCallsInCurseConnected);
              } else if (!btn_id && direction === "out") {
                //CHAMADAS REALIZADAS PELO DIALPAD SEM BTN_ID
                const dialPadCallConnected: CallsInterface = {
                  callId: parseInt(call_innovaphone),
                  num: number as string,
                  type: "incoming",
                  connected: true,
                  ringing: false,
                  startTime: callStartTime,
                  held: false,
                  heldByUser: false,
                  device: device,
                };
                addCall(dialPadCallConnected);
              }
            }
            // CHAMADAS NAO CONECTADAS , OU SEJA , QUE ESTÃO RINGING TANTO INCOMING QUANTO OUTCOMING
            else if (
              !call_connected &&
              call_ringing !== null &&
              !btn_id &&
              direction === "inc"
            ) {
              const incomingCallsInCurseRinging: CallsInterface = {
                callId: parseInt(call_innovaphone),
                num: number as string,
                type: "incoming",
                connected: true,
                ringing: true,
                startTime: null,
                held: false,
                heldByUser: false,
                device: device,
                deviceText: deviceText,
              };
              addCall(incomingCallsInCurseRinging);
              setSelectedOptBottom("call");
            } else if (
              !call_connected &&
              call_ringing !== null &&
              !btn_id &&
              direction === "out"
            ) {
              const dialPadCallsInCurseRinging: CallsInterface = {
                callId: parseInt(call_innovaphone),
                num: number as string,
                type: "dialpad",
                connected: true,
                ringing: true,
                startTime: null,
                held: false,
                heldByUser: false,
                device: device,
                deviceText: deviceText,
              };
              addCall(dialPadCallsInCurseRinging);
              setSelectedOptBottom("call");
            } else if (
              !call_connected &&
              call_ringing !== null &&
              btn_id &&
              direction === "out"
            ) {
              const buttonCallInCurseRinging: CallsInterface = {
                callId: parseInt(call_innovaphone),
                num: number as string,
                type: "buttonCall",
                btn_id: btn_id,
                connected: true,
                ringing: true,
                startTime: null,
                held: false,
                heldByUser: false,
                device: device,
                deviceText: deviceText,
              };
              addCall(buttonCallInCurseRinging);
              setSelectedOptBottom("call");
            }
          });
        }
        break;

      case "IncomingCallRing":
        setSelectedOptBottom("call");

        const incomingCall: CallsInterface = {
          callId: message.call as number,
          num: message.num as string,
          type: "incoming",
          connected: true,
          ringing: true,
          startTime: null,
          held: false,
          heldByUser: false,
          device: message.device,
          deviceText: message.deviceText,
        };
        addCall(incomingCall);

        break;
      case "IncomingCallConnected":
        updateCall(message.call as number, {
          num: message.num as string,
          connected: true,
          ringing: false,
          startTime: Date.now(),
        });
        setSelectedOptBottom("call");
        break;
      case "IncomingCallDisconnected":
        removeCall(message.call);
        break;
      case "CallConnecting":
        //tratar chamadas conectando aqui
        break;
      case "CallRinging":
        if (message.btn_id) {
          setButtonClickedStatus(
            message.btn_id,
            "callRinging",
            "bg-orange-700",
            true,
            false,
            true
          );
          const call: CallsInterface = {
            callId: message.call as number,
            num: message.num as string,
            type: "buttonCall",
            connected: true,
            ringing: true,
            startTime: null,
            held: false,
            heldByUser: false,
            device: message.device,
            btn_id: message.btn_id,
          };
          addCall(call);
          setSelectedOptBottom("call");
        } else {
          const dialPadCall: CallsInterface = {
            callId: message.call as number,
            num: message.num as string,
            type: "dialpad",
            connected: true,
            ringing: true,
            startTime: null,
            held: false,
            heldByUser: false,
            device: message.device,
          };
          addCall(dialPadCall);
        }
        break;
      case "CallConnected":
        setSelectedOptBottom("call");
        // assim fica certinho os segundos no elapsedTime
        if (message.btn_id) {
          setButtonClickedStatus(
            message.btn_id,
            "callConnected",
            "bg-red-900",
            false,
            true,
            true
          );
          addCall({
            callId: message.call as number,
            num: message.num as string,
            connected: true,
            ringing: false,
            startTime: Date.now(),
            device: message.device,
            btn_id: message.btn_id,
            type: "buttonCall",
            held: false,
            heldByUser: false,
          });
        } else {
          //CHAMADAS REALIZADAS PELO DIALPAD SEM BTN_ID
          addCall({
            callId: message.call as number,
            num: message.num as string,
            connected: true,
            ringing: false,
            startTime: Date.now(),
            device: message.device,
            btn_id: message.btn_id,
            type: "dialpad",
            held: false,
            heldByUser: false,
          });
        }

        break;
      case "CallDisconnected":
        setButtonClickedStatus(
          message.btn_id,
          "callDisconnected",
          "",
          false,
          false,
          false
        );
        removeCall(message.call);
        break;
      case "CallHeld":
        // usuario me colocou em espera
        if (message.btn_id !== "") {
          setButtonClickedStatus(
            message.btn_id,
            "callHeld",
            "bg-purple-900",
            false,
            true,
            true
          );
          updateCall(message.call as number, {
            heldByUser: true,
          });
        } else {
          updateCall(message.call as number, {
            heldByUser: true,
          });
        }
        break;
      case "CallRetrieved":
        if (message.btn_id !== "") {
          setButtonClickedStatus(
            message.btn_id,
            "callRetrieved",
            "bg-red-900",
            false,
            true,
            true
          );
          updateCall(message.call as number, {
            num: message.num,
            heldByUser: false,
            btn_id: message.btn_id,
          });
        } else {
          // atualizar o num nesse caso por causa da conferencia
          updateCall(message.call as number, {
            num: message.num,
            heldByUser: false,
            btn_id: message.btn_id,
          });
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
            false,
            true,
            true
          );
          updateCall(message.call as number, {
            num: message.num,
            held: false,
            btn_id: message.btn_id,
          });
        } else {
          updateCall(message.call as number, {
            num: message.num,
            held: false,
            btn_id: null,
            type: "incoming",
          });
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
            false,
            true,
            true
          );
          updateCall(message.call as number, {
            held: true,
          });
        } else {
          updateCall(message.call as number, {
            held: true,
          });
        }
        //eu coloquei em espera
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
        if (clickedUserTopRef.current !== newMsgFrom.from_guid) {
          setPlayNotificationSoundChat(true); // Toca o som de notificação
          setTimeout(() => setPlayNotificationSoundChat(false), 500);
        }

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

        setSensorNotificationSound(sensorNotification.value);
        setAlarmNotificationSound(alarmNotification.value);
        setChatNotificationSound(chatNotification.value);

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
        setBusyLightColor()
        toast({
          description: "Botão Vermelho Disparou",
        });
        break;
      case "UserEvent":
        const myUser = allUsers.filter((u) => {
          return u.guid === account.guid;
        })[0];

        const filteredPbxUser = pbxUser.filter((userPbx) => {
          return userPbx.guid === myUser.sip;
        })[0];

        updateUserDevices(message.devices, filteredPbxUser.guid);
        break;
      case "TriggerStopAlarmResult":
        setButtonTriggered(message.btn_id, false);
        break;
      case "getHistoryResult":
        if (message.result.length > 0) {
          const historyArray = message.result;
          historyArray.forEach((hist: any) => {
            addHistory(hist);
          });
        } else {
          setHistoryComplete(true);
        }

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
    clickedUserTopRef.current = newUser;
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
        {/* {isLoading ? (
              <Loader />
            ) : ( */}
        <>
          <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
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
          </DndProvider>
        </>
        {/* )} */}
      </WebSocketProvider>
      {/* soundPlayer para cada Notificação */}
      {alarmNotificationSound && (
        <SoundPlayer
          soundSrc={getSoundSrc(alarmNotificationSound) as string}
          play={playNotificationSoundAlarm}
        />
      )}

      {sensorNotificationSound && (
        <SoundPlayer
          soundSrc={getSoundSrc(sensorNotificationSound) as string}
          play={playNotificationSoundSensor}
        />
      )}

      {chatNotificationSound && (
        <SoundPlayer
          soundSrc={getSoundSrc(chatNotificationSound) as string}
          play={playNotificationSoundChat}
        />
      )}
    </>
  );
}

export default ValidadeToken(UserLayout);
