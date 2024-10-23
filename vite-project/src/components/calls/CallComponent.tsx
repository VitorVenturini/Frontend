import {
  Pause,
  PhoneCall,
  Play,
  PhoneOff,
  PhoneForwarded,
  Keyboard as KeyboardIcon,
  User2,
} from "lucide-react";
import {
  ButtonInterface,
  useButtons,
} from "../buttons/buttonContext/ButtonsContext";
import { useUsersPbx } from "../users/usersPbx/UsersPbxContext";
import { generateAvatar, getInitials } from "../utils/utilityFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Keyboard from "../utils/Keyboard";
import { CallsInterface, useCalls } from "../calls/CallContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDrag } from "react-dnd";

interface CallComponentProps {
  call: CallsInterface;
}
export default function CallComponent({ call }: CallComponentProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const { usersPbx } = useUsersPbx();
  const { setHeldCall, setClickedStatusClass } = useButtons();
  const wss = useWebSocketData();
  const [callStateClass, setCallStateClass] = useState<string>("");
  // const [heldIncomingCall,setHeldStateIncomingCall] = useState( || false)
  const [openKeyboardDTMF, setOpenKeyboardDTMF] = useState(false);
  const [openKeyboard, setOpenKeyboard] = useState(false);

  const filteredUser = usersPbx?.filter((user) => {
    return user.e164 === call.num;
  })[0];

  const initials = getInitials(filteredUser?.cn);
  const avatarBase64 = initials ? generateAvatar(initials) : null;

  useEffect(() => {
    if (call?.connected && call?.startTime !== null) {
      // call.startTime já está em milissegundos, então não precisa de conversão.
      const nowInTimeStamp = Date.now(); // Pega o timestamp atual
  
      // Calcula o tempo inicial decorrido em segundos
      const initialElapsedTime = Math.floor((nowInTimeStamp - call.startTime) / 1000);
      setElapsedTime(initialElapsedTime); // Define o tempo decorrido inicial
  
      // A cada segundo, incrementa o tempo decorrido
      const id = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1); // Incrementa o tempo em 1 segundo a cada intervalo
      }, 1000);
  
      setIntervalId(id);

      // const startTime = button.startTime;
      // const elapsedTime = Date.now() - startTime + (button.time || 0);
      // setTime(elapsedTime);
      // const id = setInterval(() => {
      //   setTime(Date.now() - startTime + (button.time || 0));
      // }, 10);
      // setIntervalId(id);

    } else if (!call?.connected && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [call.startTime]);
  
  // Função para formatar a duração da chamada em HH:MM:SS
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleHeldCall = () => {
    if (call.type === "incoming") {
      wss?.sendMessage({
        api: "user",
        mt: "HeldIncomingCall",
        device: call?.device,
        num: call?.num,
        call: call?.callId,
      });
    } else if (call.type === "dialpad") {
      wss?.sendMessage({
        api: "user",
        mt: "HeldCall",
        device: call?.device,
        call: call?.callId,
      });
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "HeldCall",
        btn_id: call?.btn_id,
      });
    }
  };
  const handleRetrieveCall = () => {
    if (call.type === "incoming") {
      wss?.sendMessage({
        api: "user",
        mt: "RetrieveIncomingCall",
        device: call?.device,
        num: call?.num,
        call: call?.callId,
      });
    } else if (call.type === "dialpad") {
      wss?.sendMessage({
        api: "user",
        mt: "RetrieveCall",
        device: call?.device,
        call: call?.callId,
      });
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "RetrieveCall",
        btn_id: call?.btn_id,
      });
    }
  };

  const handleEndCall = () => {
    if (call.type === "incoming") {
      wss?.sendMessage({
        api: "user",
        mt: "EndIncomingCall",
        device: call?.device,
        num: call?.num,
      });
    } else if (call.type === "dialpad") {
      wss?.sendMessage({
        api: "user",
        mt: "EndCall",
        device: call?.device,
        call: call?.callId,
      });
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "EndCall",
        btn_id: call?.btn_id,
      });
    }
  };
  const handleKeyPress = (key: string) => {
    console.log("Key pressed:", key);
  };
  // // monitorar se a ligação está em espera ou nao
  useEffect(() => {
    console.log("TESTE");
    if (call?.held) {
      // eu coloquei em espera
      setCallStateClass("border-blue-800 outline-blue-800");
      // setClickedStatusClass(
      //   buttonOnCall.id,
      //   "border-blue-800 outline-blue-800"
      // );
    } else if (call?.heldByUser) {
      // usuário me colocou em espera
      setCallStateClass("border-purple-900 outline-purple-900");
      // setClickedStatusClass(
      //   buttonOnCall.id,
      //   "border-purple-900 outline-purple-900"
      // );
    } else if (call?.ringing) {
      setCallStateClass("border-orange-600 outline-orange-600");
      // setClickedStatusClass(
      //   buttonOnCall?.id as number,
      //   "border-orange-800 outline-orange-800"
      // );
    } else {
      // eu tirei da espera ou o usuario tirou da espera
      setCallStateClass("border-red-800 outline-red-800");
      // setClickedStatusClass(
      //   buttonOnCall?.id as number,
      //   "border-red-800 outline-red-800"
      // );
    }
  }, [call]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CALL",
    item: { call: call },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  // console.log("ButtonCALL " + buttonOnCall.call)
  return (
    <Card
      ref={drag}
      className={`px-2 py-5 m-1 gap-2 outline outline-2 border-xs ${callStateClass}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-center gap-3 w-full ">
        {avatarBase64 !== null ? (
          <Avatar>
            <AvatarImage src={avatarBase64 as string} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <User2 />
        )}
        <div>{filteredUser?.cn || call?.num}</div>
        {/* {<div>"SEM NOME POR ENQUANTO"</div>} */}
        {/*TRATAMENTO PARA RINGING E CONNECTED */}
        {(call?.type === "buttonCall" || call?.type === "dialpad") &&
        call?.ringing ? (
          <div className="flex items-center gap-3">
            <div>Chamando...</div>
            <Button onClick={handleEndCall} size="icon" variant="destructive">
              <PhoneOff />
            </Button>{" "}
          </div>
        ) : (
          <>
            <div className="text-xs mt-1">
              <div>{formatDuration(elapsedTime)}</div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <Popover
                  open={openKeyboardDTMF}
                  onOpenChange={setOpenKeyboardDTMF}
                >
                  <PopoverTrigger>
                    <Button size="icon" variant="secondary">
                      {" "}
                      <KeyboardIcon />{" "}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Keyboard
                      onKeyPress={handleKeyPress}
                      forwarded={false}
                      call={call}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={call.held ? handleRetrieveCall : handleHeldCall}
                size="icon"
                variant="secondary"
              >
                {call.held ? <Play /> : <Pause />}
              </Button>
              <div>
                <Popover open={openKeyboard} onOpenChange={setOpenKeyboard}>
                  <PopoverTrigger>
                    <Button size="icon" variant="secondary">
                      <PhoneForwarded />{" "}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Keyboard
                      onKeyPress={handleKeyPress}
                      forwarded={true}
                      call={call}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleEndCall} size="icon" variant="destructive">
                <PhoneOff />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
