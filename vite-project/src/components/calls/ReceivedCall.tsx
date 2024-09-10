import { Card } from "@/components/ui/card";
import { IncomingCallInterface } from "./CallContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsersPbx } from "../users/usersPbx/UsersPbxContext";
import { generateAvatar, getInitials } from "../utils/utilityFunctions";
import { Phone, PhoneOff, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ReceivedCallProps {
  receivedCalls: IncomingCallInterface[]; // Agora recebemos um array de chamadas
}

export default function ReceivedCall({ receivedCalls }: ReceivedCallProps) {
  const { usersPbx } = useUsersPbx();
  const wss = useWebSocketData();

  const filteredIncomingCallUser = usersPbx?.filter((user) => {
    return user.e164 === receivedCalls[0]?.num; // Filtra pelo número da primeira chamada
  })[0];

  const initials = getInitials(filteredIncomingCallUser?.cn);
  const avatarBase64 = initials ? generateAvatar(initials) : null;

  // Função para atender a chamada de um device específico
  const handleSelectDevice = (device: string, callId: string) => {
    console.log("Device Escolhido: " + device);
    wss?.sendMessage({
      api: "user",
      mt: "ConnectCall",
      device: device,
      call: callId,
    });
  };

  // Função para recusar todas as chamadas do mesmo número
  const handleRefuseAllCalls = () => {
    receivedCalls.forEach((call) => {
      wss?.sendMessage({
        api: "user",
        mt: "ClearCall",
        call: call.callId,
      });
    });
  };

  return (
    <Card className="relative px-4 py-6 m-3 space-y-2">
      <div className="absolute inset-0 bg-muted animate-pulse "></div>
      <div className="relative z-10 space-y-2">
        <div className="flex justify-between">
          {/*blinking-border*/}
          <div className="flex items-center gap-2">
            {avatarBase64 !== null ? (
              <Avatar>
                <AvatarImage src={avatarBase64 as string} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <User2 />
            )}
            <div className="flex gap-2">
              Chamada recebida:
              <b>
                {filteredIncomingCallUser
                  ? filteredIncomingCallUser?.cn
                  : receivedCalls[0]?.num}
              </b>
            </div>
          </div>

          {/* Renderiza um botão para cada dispositivo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button
                onClick={handleRefuseAllCalls}
                size="icon"
                variant="destructive"
              >
                <PhoneOff />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {receivedCalls.map((call) => (
            <Button
              key={call.device}
              onClick={() => handleSelectDevice(call.device, call.callId)}
              className="gap-2 bg-green-600 hover:bg-green-600/60 mx-1"
            >
              <Phone />
              {call.deviceText}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
