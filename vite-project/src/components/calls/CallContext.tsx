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

export interface DialPadCallsInterface {
  id: string;
  device: string;
  deviceText?: string;
  num?: string;
  callId: string;
  connected?: boolean;
  held?: boolean;
  heldByUser?: boolean;
}

interface CallContextProps {
  calls: ButtonInterface[];
  dialPadCalls: DialPadCallsInterface[];
  incomingCalls: IncomingCallInterface[];
  addDialPadCalls: (
    dialPadCalls: DialPadCallsInterface,
    duration?: number
  ) => void;
  removeDialPadCalls: (callID: string) => void;
  addCall: (button: ButtonInterface, duration: number) => void;
  removeCall: (buttonId: string) => void;
  getCallDuration: (buttonId: number) => number;
  addIncomingCall: (
    incomingCall: IncomingCallInterface,
    duration?: number
  ) => void;
  removeIncomingCall: (callId: string) => void;
  updateIncomingCall: (Incomingcall: IncomingCallInterface) => void;
  setHeldIncomingCall: (callID: string, isHeld: boolean) => void;
  setHeldIncomingCallByUser: (callID: string, isHeld: boolean) => void;
  setHeldDialPadCall: (callID: string, isHeld: boolean) => void;
  setHeldDialPadCallByUser: (callID: string, isHeld: boolean) => void;
  getIncomingCallDuration: (callId: string) => number;
  getDialPadCallsDuration: (callId: string) => number;
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

  const [dialPadCalls, setDialPadCalls] = useState<DialPadCallsInterface[]>([]);  
  const [dialPadStartTimes, setDialPadStartTimes] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const onCallButtons = buttons.filter((btn) => btn.onCall || btn.ringing);
    setCalls(onCallButtons);

    const connectedCallBtn = buttons.filter((btn) => btn.onCall && btn.connected);

    // Inicializa os tempos de início para novas chamadas QUE ESTÃO CONECTADAS!!!
    connectedCallBtn.forEach((button) => {
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
        setIncomingStartTimes((prev) => ({
          ...prev,
          [call.callId]: Date.now(),
        }));
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

  //monitoramento das dialPadCalls conectadas
  // Monitoramento das incomingCalls conectadas
  useEffect(() => {
    const connectedDialPadCalls = dialPadCalls.filter((call) => call.connected);
    console.log(
      "connectedDialPadCalls" + JSON.stringify(connectedDialPadCalls)
    );
    // Inicializa os tempos de início para chamadas conectadas
    connectedDialPadCalls.forEach((call) => {
      if (!dialPadStartTimes[call.id]) {
        setDialPadStartTimes((prev) => ({
          ...prev,
          [call.callId]: Date.now(),
        }));
      }
    });

    // Remove entradas para chamadas desconectadas
    Object.keys(dialPadStartTimes).forEach((callID) => {
      if (!connectedDialPadCalls.find((call) => call.callId === callID)) {
        setDialPadStartTimes((prev) => {
          const { [callID]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  }, [dialPadCalls]);

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

  const setHeldDialPadCall = (callID: string, isHeld: boolean) => {
    setDialPadCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.callId === callID ? { ...call, held: isHeld } : call
      )
    );
  };

  const setHeldDialPadCallByUser = (callID: string, isHeld: boolean) => {
    setDialPadCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.callId === callID ? { ...call, heldByUser: isHeld } : call
      )
    );
  };

  const updateIncomingCall = (Incomingcall: IncomingCallInterface) => {
    setIncomingCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.id === Incomingcall.id ? { ...call, ...Incomingcall } : call
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

  const addDialPadCalls = (
    dialPadCalls: DialPadCallsInterface,
    duration?: number
  ) => {
    setDialPadCalls((prev) => {
      const existingCallIndex = prev.findIndex(
        (call) => call.callId === dialPadCalls.callId
      );

      if (existingCallIndex !== -1) {
        // Atualiza a chamada existente
        const updatedCalls = [...prev];
        updatedCalls[existingCallIndex] = {
          ...updatedCalls[existingCallIndex],
          ...dialPadCalls,
        };
        return updatedCalls;
      } else {
        // Adiciona uma nova chamada se não existir
        return [...prev, dialPadCalls];
      }
    });

    if (dialPadCalls.connected) {
      if (duration !== undefined) {
        setDialPadStartTimes((prev) => ({
          ...prev,
          [dialPadCalls.id]: Date.now() - duration * 1000,
        }));
      } else {
        setDialPadStartTimes((prev) => ({
          ...prev,
          [dialPadCalls.id]: Date.now(),
        }));
      }
    }
  };

  const removeDialPadCalls = (callId: string) => {
    setDialPadCalls((prev) => prev.filter((call) => call.callId !== callId));
    setDialPadStartTimes((prev) => {
      const { [callId]: _, ...rest } = prev;
      return rest;
    });
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

  const getDialPadCallsDuration = (callId: string) => {
    const startTime = dialPadStartTimes[callId];
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };
  return (
    <CallContext.Provider
      value={{
        calls,
        dialPadCalls,
        addDialPadCalls,
        removeDialPadCalls,
        getDialPadCallsDuration,
        setHeldDialPadCall,
        setHeldDialPadCallByUser,
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
