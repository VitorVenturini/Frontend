import React, { createContext, useContext, useState, useEffect } from "react";
import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";

export interface IncomingCallInterface {
  id: string;
  device: string;
  deviceText: string;
  num: string;
  callId: string;
  connected: boolean;
  held?: boolean;
  heldByUser?: boolean;
}

interface CallContextProps {
  calls: ButtonInterface[];
  incomingCalls: IncomingCallInterface[];
  addCall: (button: ButtonInterface, duration: number) => void;
  removeCall: (buttonId: string) => void;
  getCallDuration: (buttonId: number) => number;
  addIncomingCall: (
    incomingCall: IncomingCallInterface,
    duration?: number
  ) => void;
  removeIncomingCall: (callId: string) => void;
  updateIncomingCall : (Incomingcall: IncomingCallInterface) => void;
  setHeldIncomingCall: (callID: string, isHeld: boolean) => void;
  setHeldIncomingCallByUser: (callID: string, isHeld: boolean) => void;
  getIncomingCallDuration: (callId: string) => number;
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
  const [incomingCalls, setIncomingCalls] = useState<IncomingCallInterface[]>(
    []
  );
  const [incomingStartTimes, setIncomingStartTimes] = useState<{
    [key: string]: number;
  }>({});

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
    const connectedIncomingCalls = incomingCalls.filter(
      (call) => call.connected
    );
    console.log(
      "connectedIncomingCalls" + JSON.stringify(connectedIncomingCalls)
    );
    // Inicializa os tempos de início para chamadas conectadas
    connectedIncomingCalls.forEach((call) => {
      if (!incomingStartTimes[call.id]) {
        setIncomingStartTimes((prev) => ({ ...prev, [call.callId]: Date.now() }));
      }
    });

    // Remove entradas para chamadas desconectadas
    Object.keys(incomingStartTimes).forEach((callID) => {
      if (!connectedIncomingCalls.find((call) => call.callId === callID)) {
        setIncomingStartTimes((prev) => {
          const { [callID]: _, ...rest } = prev;
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

  const setHeldIncomingCall = (callID: string, isHeld: boolean) => {
    setIncomingCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.callId === callID ? { ...call, held: isHeld } : call
      )
    );
  };

  const setHeldIncomingCallByUser = (callID: string, isHeld: boolean) => {
    setIncomingCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.callId === callID ? { ...call, heldByUser: isHeld } : call
      )
    );
  };

  const updateIncomingCall = (Incomingcall: IncomingCallInterface) => {
    setIncomingCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.id === Incomingcall.id
          ? { ...call, ...Incomingcall }
          : call
      )
    );
  };

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

  const addIncomingCall = (
    incomingCall: IncomingCallInterface,
    duration?: number
  ) => {
    setIncomingCalls((prev) => {
      const existingCallIndex = prev.findIndex(
        (call) => call.callId === incomingCall.callId
      );

      if (existingCallIndex !== -1) {
        // Atualiza a chamada existente
        const updatedCalls = [...prev];
        updatedCalls[existingCallIndex] = {
          ...updatedCalls[existingCallIndex],
          ...incomingCall,
        };
        return updatedCalls;
      } else {
        // Adiciona uma nova chamada se não existir
        return [...prev, incomingCall];
      }
    });

    if (incomingCall.connected) {
      if (duration !== undefined) {
        setIncomingStartTimes((prev) => ({
          ...prev,
          [incomingCall.id]: Date.now() - duration * 1000,
        }));
      } else {
        setIncomingStartTimes((prev) => ({
          ...prev,
          [incomingCall.id]: Date.now(),
        }));
      }
    }
  };

  const removeIncomingCall = (callId: string) => {
    setIncomingCalls((prev) => prev.filter((call) => call.callId !== callId));
    setIncomingStartTimes((prev) => {
      const { [callId]: _, ...rest } = prev;
      return rest;
    });
  };

  const hideIncomingCall = (callID: string) => {
    setIncomingCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.callId === callID ? { ...call, connected: false } : call
      )
    );
  };

  const getCallDuration = (buttonId: number) => {
    const startTime = startTimes[buttonId];
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const getIncomingCallDuration = (callId: string) => {
    const startTime = incomingStartTimes[callId];
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  return (
    <CallContext.Provider
      value={{
        calls,
        incomingCalls,
        addIncomingCall,
        updateIncomingCall,
        setHeldIncomingCall,
        setHeldIncomingCallByUser,
        removeIncomingCall,
        addCall,
        removeCall,
        getCallDuration,
        getIncomingCallDuration,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
