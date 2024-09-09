import { Card } from "@/components/ui/card";
import { IncomingCallInterface } from "./CallContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsersPbx } from "../users/usersPbx/UsersPbxContext";
import { generateAvatar, getInitials } from "../utils/utilityFunctions";
import { Phone, PhoneOff, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";

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
    <Card className="gap-2 mt-1">
      {/*blinking-border*/}
      <div className="flex items-center gap-3 m-2">
        {avatarBase64 !== null ? (
          <Avatar>
            <AvatarImage src={avatarBase64 as string} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <User2 />
        )}
        <div>
          Chamada Recebida de: <b>{filteredIncomingCallUser ? filteredIncomingCallUser?.cn : receivedCalls[0]?.num}</b>
        </div>
      </div>

      {/* Renderiza um botão para cada dispositivo */}
      <div className="flex items-center gap-2">
      <div>
        {receivedCalls.map((call) => (
          <Button
            key={call.device}
            variant="default"
            onClick={() => handleSelectDevice(call.device, call.callId)}
            className="gap-2 bg-green-600 rounded-xl m-2 font-bold"
          >
            <Phone/>
            {call.deviceText}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4 ">
        <Button onClick={handleRefuseAllCalls} size="icon" variant="destructive" className="rounded-xl">
          <PhoneOff />
        </Button>
      </div>
      </div>
    </Card>
  );
}
