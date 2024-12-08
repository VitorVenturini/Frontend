import { createContext, useState, useContext, ReactNode } from "react";
import { SetStateAction } from "react";

export interface CallDetails {
  id: string;
  guid: string;
  number: string;
  call_started: string | null;
  call_ringing: string | null;
  call_connected: string | null;
  call_ended: string | null;
  status: number;
  direction: string;
  record_id: string | null;
  btn_id: string | null;
  call_innovaphone: string;
  device: string;
  record_link: string;
}

export interface HistoryInterface {
  id: string;
  guid: string;
  from: string;
  name: string;
  date: string;
  status: string;
  value?: string;
  prt: string;
  details: CallDetails; // Alterado de string para o tipo correto
}

interface HistoryContextType {
  history: HistoryInterface[];
  addHistory: (newHistory: HistoryInterface) => void;
 // updateHistory: (updatedHistory: HistoryInterface) => void;
  clearHistory: () => void;
  setHistoryComplete: React.Dispatch<SetStateAction<boolean>>
  historyComplete: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
    const [history, setHistoryState] = useState<HistoryInterface[]>([]);
    const [historyComplete, setHistoryComplete] = useState<boolean>(false);

  const addHistory = (newHistory: HistoryInterface) => {
    // Verifica se já existe uma entrada com o mesmo id
    const isDuplicate = history.some((hist) => hist.id === newHistory.id);

    // Só adiciona se não for duplicado
    if (!isDuplicate) {
      setHistoryState((prevHistory) => [newHistory, ...prevHistory]);
    }
  };


  const clearHistory = () => {
    setHistoryState([]);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistory,
        setHistoryComplete,
        historyComplete,
       // updateHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
