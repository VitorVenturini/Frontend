import {
  Pause,
  PhoneCall,
  Play,
  PhoneOff,
  PhoneForwarded,
  Keyboard as KeyboardIcon,
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

interface CallComponentProps {
  buttonOnCall: ButtonInterface;
}
export default function CallComponent({ buttonOnCall }: CallComponentProps) {
  {
    /*se nao tiver chamadas retorna um skeleton */
  }
  const { usersPbx } = useUsersPbx();
  const { setHeldCall } = useButtons();
  const wss = useWebSocketData();
  const [heldCall, setHeldStateCall] = useState(buttonOnCall.held || false);
  const [callDuration, setCallDuration] = useState(0);
  const [openKeyboard, setOpenKeyboard] = useState(false);
  //const [retrieveCall, setRetrieveCall] = useState<boolean>(false);

  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === buttonOnCall.button_prt;
  })[0];

  const initials = getInitials(filteredUser?.cn || "Usuário");
  const avatarBase64 = generateAvatar(initials);

  //contador
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setCallDuration(elapsedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleHeldCall = () => {
    wss?.sendMessage({
      api: "user",
      mt: "HeldCall",
      btn_id: buttonOnCall.id,
    });
    setHeldStateCall(true);
    setHeldCall(buttonOnCall.id, true);
  };
  const handleRetrieveCall = () => {
    wss?.sendMessage({
      api: "user",
      mt: "RetrieveCall",
      btn_id: buttonOnCall.id,
    });
    // setRetrieveCall(true);
    setHeldStateCall(false);
    setHeldCall(buttonOnCall.id, false);
  };

  const handleEndCall = () => {
    wss?.sendMessage({
      api: "user",
      mt: "EndCall",
      btn_id: buttonOnCall.id,
    });
  };
  const handleKeyPress = (key: string) => {
    console.log("Key pressed:", key);
  };

  return (
    <div className="py-2 px-2 gap-4 flex bg-muted justify-between rounded-md my-2 items-center w-full mr-2">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarBase64} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>{filteredUser ? filteredUser.cn : buttonOnCall.button_prt}</div>
        <div className="text-xs">{formatDuration(callDuration)}</div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="bg-background p-2 rounded-xl cursor-pointer"
          onClick={heldCall ? handleRetrieveCall : handleHeldCall}
        >
          {heldCall ? <Play /> : <Pause />}
        </div>
        <div className="bg-background p-2 rounded-xl cursor-pointer">
          <PhoneForwarded />
        </div>
        <div
          className="bg-background p-2 rounded-xl cursor-pointer"
          onClick={handleEndCall}
        >
          <PhoneOff />
        </div>
        <div className="bg-background p-2 rounded-xl cursor-pointer items-center flex">
          <Popover open={openKeyboard} onOpenChange={setOpenKeyboard}>
            <PopoverTrigger>
              <KeyboardIcon />
            </PopoverTrigger>
            <PopoverContent>
              <Keyboard onKeyPress={handleKeyPress} />
            </PopoverContent>
          </Popover>
        </div>
        {/* POPOVER DO TECLADO AQUI VOU UTILIZA-LO NOVAMNETE MAS POR ENQUANTO DEIXA ASSIM*/}
      </div>
    </div>
  );
}