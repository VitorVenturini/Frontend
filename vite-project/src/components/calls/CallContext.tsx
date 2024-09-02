import React, { createContext, useContext, useState, useEffect } from "react";
import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";

export interface IncomingCallInterface {
  id: string;
  device: string;
  num: string;
  callId: number;
  connected: boolean;
}

interface CallContextProps {
  calls: ButtonInterface[];
  incomingCalls: IncomingCallInterface[];
  addCall: (button: ButtonInterface, duration: number) => void;
  removeCall: (buttonId: string) => void;
  getCallDuration: (buttonId: number) => number;
  addIncomingCall: (incomingCall: IncomingCallInterface) => void;
  removeIncomingCall: (callId: string) => void;
  getIncomingCallDuration: (callId: number) => number;
}

const CallContext = createContext<CallContextProps | undefined>(undefined);

export const useCalls = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCalls must be used within a CallProvider");
  }
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { buttons } = useButtons();
  const [calls, setCalls] = useState<ButtonInterface[]>([]);
  const [startTimes, setStartTimes] = useState<{ [key: string]: number }>({});
  const [forceUpdate, setForceUpdate] = useState(0); // Estado para forçar re-render
  const [incomingCalls, setIncomingCalls] = useState<IncomingCallInterface[]>([]);
  const [incomingStartTimes, setIncomingStartTimes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const onCallButtons = buttons.filter((btn) => btn.onCall);
    setCalls(onCallButtons);

    // Inicializa os tempos de início para novas chamadas
    onCallButtons.forEach((button) => {
      if (!startTimes[button.id]) {
        setStartTimes((prev) => ({ ...prev, [button.id]: Date.now() }));
      }
    });

    // Remove chamadas terminadas
    Object.keys(startTimes).forEach((id) => {
      if (!onCallButtons.find((btn) => (btn.id as any) === id)) {
        setStartTimes((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  }, [buttons]);

   // Monitoramento das incomingCalls conectadas
  useEffect(() => {
    const connectedIncomingCalls = incomingCalls.filter(call => call.connected);

    // Inicializa os tempos de início para chamadas conectadas
    connectedIncomingCalls.forEach(call => {
      if (!incomingStartTimes[call.id]) {
        setIncomingStartTimes(prev => ({ ...prev, [call.id]: Date.now() }));
      }
    });

    // Remove entradas para chamadas desconectadas
    Object.keys(incomingStartTimes).forEach(id => {
      if (!connectedIncomingCalls.find(call => call.id === id)) {
        setIncomingStartTimes(prev => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  }, [incomingCalls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((prev) => prev + 1); // Força re-render a cada segundo
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addCall = (button: ButtonInterface, duration: number) => {
    setCalls((prev) => [...prev, button]);
    setStartTimes((prev) => ({
      ...prev,
      [button.id]: Date.now() - duration * 1000,
    }));
  };

  const removeCall = (buttonId: string) => {
    setCalls((prev) => prev.filter((call) => (call.id as any) !== buttonId));
    setStartTimes((prev) => {
      const { [buttonId]: _, ...rest } = prev;
      return rest;
    });
  };

  const addIncomingCall = (incomingCall: IncomingCallInterface) => {
    setIncomingCalls(prev => [...prev, incomingCall]);
    if (incomingCall.connected) {
      setIncomingStartTimes(prev => ({
        ...prev,
        [incomingCall.id]: Date.now(),
      }));
    }
  };

  const removeIncomingCall = (callId: string) => {
    setIncomingCalls(prev => prev.filter(call => call.id !== callId));
    setIncomingStartTimes(prev => {
      const { [callId]: _, ...rest } = prev;
      return rest;
    });
  };

  const getCallDuration = (buttonId: number) => {
    const startTime = startTimes[buttonId];
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const getIncomingCallDuration = (callId: number) => {
    const startTime = incomingStartTimes[callId];
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  return (
    <CallContext.Provider
      value={{ calls,incomingCalls,addIncomingCall,removeIncomingCall,addCall, removeCall, getCallDuration,getIncomingCallDuration }}
    >
      {children}
    </CallContext.Provider>
  );
};
