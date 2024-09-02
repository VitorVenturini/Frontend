import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";

export default function OptCall() {
  const { calls, incomingCalls } = useCalls();
  const wss = useWebSocketData()

  const handleSelectDevice = (device: string, callID: number) => {
    console.log("Device Escolhido" + device);
    wss?.sendMessage({
      api: "user",
      mt: "ConnectCall",
      device: device,
      call: callID
    })
  };
  const activeIncomingCalls = incomingCalls.filter((inc) => {
    return inc.connected;
  });
  return (
    <ScrollArea className="w-full h-[200px]  lg:h-[290px]  xl2:h-[400px] xl3:h-[590px]  relative gap-3">
    {calls.map((call) => (
      <CallComponent key={call.id} buttonOnCall={call} />
    ))}
    {activeIncomingCalls.map((call) => (
      <CallComponent key={call.id} incomingCall={call} />
    ))}
  
    {incomingCalls.map((call) => (
      <div key={call.id}>
        Recebendo Ligação de <b>{call.num}</b>
        <p></p>Em qual device você deseja atender a Ligação
        <Button
          variant="default"
          onClick={() => handleSelectDevice(call.device, call.callId)}
        >
          {call.device}
        </Button>
      </div>
    ))}
  </ScrollArea>
  
  );
}
