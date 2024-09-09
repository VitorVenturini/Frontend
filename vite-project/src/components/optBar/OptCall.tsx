import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import ReceivedCall from "../calls/ReceivedCall";

export default function OptCall() {
  const { calls, incomingCalls } = useCalls();
  const wss = useWebSocketData();
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() =>{
  //   console.log("ligações" + JSON.stringify(incomingCalls))
  // },[incomingCalls])

  const activeIncomingCalls = incomingCalls.filter((inc) => inc.connected);

  // Agrupamos as chamadas recebidas pelo número
  const receivedIncomingCalls = incomingCalls
    .filter((call) => !call.connected) // Somente chamadas não conectadas
    .reduce((acc: any, call) => {
      if (!acc[call.num]) {
        acc[call.num] = [];
      }
      acc[call.num].push(call); // Agrupamos as chamadas pelo número
      return acc;
    }, {});

  return (
    <ScrollArea className="w-full lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px]  relative gap-3">
      {/* CHAMADAS EM ANDAMENTO */}
      {calls.map((call) => (
        <CallComponent key={call.id} buttonOnCall={call} />
      ))}
      {/* CHAMADAS RECEBIDAS EM ANDAMENTO */}
      {activeIncomingCalls.map((call) => (
        <CallComponent key={call.id} incomingCall={call} />
      ))}

      {/* CHAMADAS RECEBIDAS QUE AINDA NAO FORAM ATENDIDAS */}
      {Object.keys(receivedIncomingCalls).map((num) => (
        <ReceivedCall key={num} receivedCalls={receivedIncomingCalls[num]} />
      ))}
    </ScrollArea>
  );
}
