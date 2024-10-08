import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import ReceivedCall from "../calls/ReceivedCall";
import DialPad from "../calls/DialPad";

export default function OptCall() {
  const { calls, incomingCalls, dialPadCalls } = useCalls();
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
    <div className="flex w-full h-full">
      {/* coluna esquerda: DialPad */}
      <div className="w-1/2 p-2">
        <DialPad />
      </div>

      {/* coluna direita: Lista de chamadas */}
      <div className="w-2/3 p-2">
        <ScrollArea className="h-full w-full">
          {/* CHAMADAS EM ANDAMENTO */}
          {calls.map((call) => (
            <CallComponent key={call.id} buttonOnCall={call} />
          ))}
      
          {/* CHAMADAS REALIZADAS PELO DIALPAD (SEM BTN_ID) EM ANDAMENTO */}
          {dialPadCalls.map((call) => (
            <CallComponent key={call.id} dialPadCall={call} />
          ))}

          {/* CHAMADAS RECEBIDAS EM ANDAMENTO */}
          {activeIncomingCalls.map((call) => (
            <CallComponent key={call.id} incomingCall={call} />
          ))}

          {/* CHAMADAS RECEBIDAS QUE AINDA NÃO FORAM ATENDIDAS */}
          {Object.keys(receivedIncomingCalls).map((num) => (
            <ReceivedCall
              key={num}
              receivedCalls={receivedIncomingCalls[num]}
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
