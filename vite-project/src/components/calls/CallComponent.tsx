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
import { IncomingCallInterface, useCalls } from "../calls/CallContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CallComponentProps {
  buttonOnCall?: ButtonInterface;
  incomingCall?: IncomingCallInterface;
}
export default function CallComponent({
  buttonOnCall,
  incomingCall,
}: CallComponentProps) {
  {
    /*se nao tiver chamadas retorna um skeleton */
  }
  const { usersPbx } = useUsersPbx();
  const { setHeldCall } = useButtons();
  const wss = useWebSocketData();
  const { getCallDuration, getIncomingCallDuration } = useCalls();
  const [heldCall, setHeldStateCall] = useState(buttonOnCall?.held || incomingCall?.held);
  // const [heldIncomingCall,setHeldStateIncomingCall] = useState( || false)
  const [callDuration, setCallDuration] = useState(0);
  const [openKeyboardDTMF, setOpenKeyboardDTMF] = useState(false);
  const [openKeyboard, setOpenKeyboard] = useState(false);
  const {setHeldIncomingCall} = useCalls()
  //const [retrieveCall, setRetrieveCall] = useState<boolean>(false);
  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === buttonOnCall?.button_prt;
  })[0];

  const filteredIncomingCallUser = usersPbx?.filter((user) => {
    return user.e164 === incomingCall?.num;
  })[0];

  const initials = getInitials(filteredUser?.cn || filteredIncomingCallUser?.cn);
  const avatarBase64 = initials ? generateAvatar(initials) : null;

  // //contador
  // useEffect(() => {
  //   const startTime = Date.now();
  //   const interval = setInterval(() => {
  //     const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  //     setCallDuration(elapsedTime);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleHeldCall = () => {
    if (incomingCall) {
      wss?.sendMessage({
        api: "user",
        mt: "HeldIncomingCall",
        device: incomingCall?.device,
        num: incomingCall?.num,
        call: incomingCall?.callId,
      });
      setHeldIncomingCall(incomingCall.callId,true)
      setHeldStateCall(true);
      // setHeldStateIncomingCall(true)
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "HeldCall",
        btn_id: buttonOnCall?.id,
      });
      setHeldCall(buttonOnCall?.id as number, true);
      setHeldStateCall(true);
    }
  };
  const handleRetrieveCall = () => {
    if (incomingCall) {
      wss?.sendMessage({
        api: "user",
        mt: "RetrieveIncomingCall",
        device: incomingCall?.device,
        num: incomingCall?.num,
        call: incomingCall?.callId,
      });
      setHeldIncomingCall(incomingCall.callId,false)
      setHeldStateCall(false);
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "RetrieveCall",
        btn_id: buttonOnCall?.id,
      });
      setHeldStateCall(false);
      setHeldCall(buttonOnCall?.id as number, false);

    }

  };

  const handleEndCall = () => {
    if (incomingCall) {
      wss?.sendMessage({
        api: "user",
        mt: "EndIncomingCall",
        device: incomingCall?.device,
        num: incomingCall?.num,
      });
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "EndCall",
        btn_id: buttonOnCall?.id,
      });
    }
  };
  const handleKeyPress = (key: string) => {
    console.log("Key pressed:", key);
  };

  return (
    <Card className="flex justify-between px-4 py-6 m-3">
      <div className="flex items-center gap-3">
        {avatarBase64 !== null ? (
          <Avatar>
            <AvatarImage src={avatarBase64 as string} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <User2 />
        )}
        {incomingCall ? (
          <div>
            {filteredIncomingCallUser
              ? filteredIncomingCallUser?.cn
              : incomingCall.num}
          </div>
        ) : (
          <div>{filteredUser ? filteredUser.cn : buttonOnCall?.button_prt}</div>
        )}
        <div className="text-xs">
          {incomingCall ? (
            <div>
              {formatDuration(getIncomingCallDuration(incomingCall.callId))}
            </div>
          ) : (
            <div>
              {formatDuration(getCallDuration(buttonOnCall?.id as number))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <Popover open={openKeyboardDTMF} onOpenChange={setOpenKeyboardDTMF}>
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
                buttonOnCall={buttonOnCall}
                incoming={incomingCall}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={heldCall ? handleRetrieveCall : handleHeldCall}
          size="icon"
          variant="secondary"
        >
          {heldCall ? <Play /> : <Pause />}
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
                buttonOnCall={buttonOnCall}
                incoming={incomingCall}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleEndCall} size="icon" variant="destructive">
          <PhoneOff />
        </Button>
        {/* POPOVER DO TECLADO AQUI VOU UTILIZA-LO NOVAMNETE MAS POR ENQUANTO DEIXA ASSIM*/}
      </div>
    </Card>
  );
}
