import React, { createContext, useContext, useState, useEffect } from "react";
import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";

export interface CallsInterface {
  callId: number;
  num: string;
  btn_id?: string;
  device?: string;
  deviceText?: string;
  type: "incoming" | "dialpad" | "buttonCall";
  connected?: boolean;
  ringing?: boolean;
  startTime?: number;
  held?: boolean;
  heldByUser?: boolean;
}

interface CallContextProps {
  calls: CallsInterface[];
  updateCall: (callId: number,updatedProps: Partial<CallsInterface>) => void;
  addCall: (call: CallsInterface) => void;
  removeCall: (callId: number) => void;
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
  const [calls, setCalls] = useState<CallsInterface[]>([]);

  const updateCall = (callId: number, updatedProps: Partial<CallsInterface>) => {
    setCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.callId === callId ? { ...call, ...updatedProps } : call
      )
    );
  };
  
  const addCall = (newCall: CallsInterface) => {
    setCalls((prevCalls) => {
      const existingCallIndex = prevCalls.findIndex(call => call.callId === newCall.callId);
  
      // Se a chamada já existir, atualiza ela
      if (existingCallIndex !== -1) {
        const updatedCalls = [...prevCalls];
        updatedCalls[existingCallIndex] = { ...updatedCalls[existingCallIndex], ...newCall };
        return updatedCalls;
      }
  
      // Se não existir, adiciona a nova chamada
      return [...prevCalls, newCall];
    });
  };

  const removeCall = (callId: number) => {
    setCalls((prev) => prev.filter((call) => call.callId !== callId));
  };

  return (
    <CallContext.Provider
      value={{
        calls,
        updateCall,
        addCall,
        removeCall
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
