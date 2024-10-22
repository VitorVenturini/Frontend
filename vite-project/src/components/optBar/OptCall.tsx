import { ScrollArea } from "@/components/ui/scroll-area";
import { CallsInterface, useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useEffect, useState } from "react";
import ReceivedCall from "../calls/ReceivedCall";
import DialPad from "../calls/DialPad";

export default function OptCall() {
  const { calls } = useCalls();
  // const activeIncomingCalls = incomingCalls.filter((inc) => inc.connected);

  // // Agrupamos as chamadas recebidas pelo número
  const receivedIncomingCalls = calls
    .filter((call) => call.ringing && call.type === "incoming") // Somente chamadas não conectadas
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
          {calls
            .filter((call) => call.connected)
            .map((call: CallsInterface) => (
              <CallComponent key={call.callId} call={call} />
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
