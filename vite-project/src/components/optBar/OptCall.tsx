import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";

export default function OptCall() {
  const { calls, incomingCalls } = useCalls();
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectDevice = (device: string, callID: string) => {
    console.log("Device Escolhido" + device);
    wss?.sendMessage({
      api: "user",
      mt: "ConnectCall",
      device: device,
      call: callID,
    });
  };

  const handleRefuseCall = (callID: string) => {
     wss?.sendMessage({
      api: "user",
      mt: "ClearCall",
      call: callID,
    });

  };
  useEffect(() =>{
    console.log("ligações" + JSON.stringify(incomingCalls))
  },[incomingCalls])
  const activeIncomingCalls = incomingCalls.filter((inc) => inc.connected);
  return (
    <ScrollArea className="w-full h-[200px]  lg:h-[290px]  xl2:h-[400px] xl3:h-[590px]  relative gap-3">
      {calls.map((call) => (
        <CallComponent key={call.id} buttonOnCall={call} />
      ))}

      {activeIncomingCalls.map((call) => (
        <CallComponent key={call.id} incomingCall={call} />
      ))}

      {incomingCalls
        .filter((call) => !call.connected)
        .map((call) => (
          <div key={call.id} className="gap-2">
            Recebendo Ligação de <b>{call.num}</b>
            <p></p>Em qual device você deseja atender a Ligação
            <Button
              variant="default"
              onClick={() => handleSelectDevice(call.device, call.callId)}
            >
              {call.deviceText}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRefuseCall(call.callId)}
            >
              Recusar
            </Button>
          </div>
        ))}
    </ScrollArea>
  );
}
