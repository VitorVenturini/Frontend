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
  const { setHeldCall, setClickedStatusClass } = useButtons();
  const wss = useWebSocketData();
  const { getCallDuration, getIncomingCallDuration } = useCalls();
  const [callStateClass, setCallStateClass] = useState<string>("");
  // const [heldIncomingCall,setHeldStateIncomingCall] = useState( || false)
  const [openKeyboardDTMF, setOpenKeyboardDTMF] = useState(false);
  const [openKeyboard, setOpenKeyboard] = useState(false);
  //const [retrieveCall, setRetrieveCall] = useState<boolean>(false);
  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === buttonOnCall?.button_prt;
  })[0];

  const filteredIncomingCallUser = usersPbx?.filter((user) => {
    return user.e164 === incomingCall?.num;
  })[0];

  const initials = getInitials(
    filteredUser?.cn || filteredIncomingCallUser?.cn
  );
  const avatarBase64 = initials ? generateAvatar(initials) : null;

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
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "HeldCall",
        btn_id: buttonOnCall?.id,
      });
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
    } else {
      wss?.sendMessage({
        api: "user",
        mt: "RetrieveCall",
        btn_id: buttonOnCall?.id,
      });
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
  // monitorar se a ligação está em espera ou nao
  useEffect(() => {
    if (buttonOnCall?.held) {
      // eu coloquei em espera
      setCallStateClass("border-blue-800 outline-blue-800");
      setClickedStatusClass(
        buttonOnCall.id,
        "border-blue-800 outline-blue-800"
      );
    } else if (buttonOnCall?.heldByUser) {
      // usuário me colocou em espera
      setCallStateClass("border-purple-900 outline-purple-900");
      setClickedStatusClass(
        buttonOnCall.id,
        "border-purple-900 outline-purple-900"
      );
    } else {
      // eu tirei da espera ou o usuario tirou da espera
      setCallStateClass("border-red-800 outline-red-800");
      setClickedStatusClass(
        buttonOnCall?.id as number,
        "border-red-800 outline-red-800"
      );
    }
  }, [buttonOnCall]);

  useEffect(() => {
    if (incomingCall?.held) {
      // eu coloquei em espera a incomingCall
      setCallStateClass("border-blue-800 outline-blue-800");
    } else if (incomingCall?.heldByUser) {
      // usuário me colocou em espera ( a incomingCall )
      setCallStateClass("border-purple-900 outline-purple-900");
    } else {
      // eu tirei da espera ou o usuario tirou da espera a incomingCall
      setCallStateClass("border-red-800 outline-red-800");
    }
  }, [incomingCall]);
  return (
    <Card
      className={`flex justify-between px-2 py-5 m-1  gap-2 outline outline-2 border-xs  ${callStateClass} `}
    >
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
        <div className="text-xs mt-1">
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
          onClick={
            buttonOnCall?.held || incomingCall?.held
              ? handleRetrieveCall
              : handleHeldCall
          }
          size="icon"
          variant="secondary"
        >
          {buttonOnCall?.held || incomingCall?.held ? <Play /> : <Pause />}
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
