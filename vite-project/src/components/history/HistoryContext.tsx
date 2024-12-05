import { createContext, useState, useContext, ReactNode } from "react";
import { SetStateAction } from "react";

export interface historyDetails {
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
  action_name: string;
  action_exec_device: string;
  action_exec_prt: string;
  action_exec_type: string;
  action_exec_type_command_mode: string;
  action_exec_user: string;
  action_start_device: string;
  action_start_device_parameter: string;
  action_start_prt: string;
  action_start_type: string;
  create_user: string;
  createdAt: string;
  updatedAt: string;
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
  details: historyDetails; // Alterado de string para o tipo correto
}

interface HistoryContextType {
  history: HistoryInterface[];
  addHistory: (newHistory: HistoryInterface) => void;
  // updateHistory: (updatedHistory: HistoryInterface) => void;
  clearHistory: () => void;
  setHistoryComplete: React.Dispatch<SetStateAction<boolean>>;
  historyComplete: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistoryState] = useState<HistoryInterface[]>([]);
  const [historyComplete, setHistoryComplete] = useState<boolean>(false);

  const addHistory = (newHistory: HistoryInterface) => {
    // Verifica se já existe uma entrada com o mesmo id
    const isDuplicate = history.some((hist) => hist.id === newHistory.id);

    console.log("histContext newHistory", newHistory);
    console.log("histContext history", history);

    if (!isDuplicate) {
      // Se não for duplicado, adiciona ao histórico
      console.log("//////////////  NEW History /////////////", newHistory);
      setHistoryState((prevHistory) => [newHistory, ...prevHistory]);
    } else {
      // Se for duplicado, atualiza o item correspondente
      setHistoryState((prevHistory) =>
        prevHistory.map((hist) =>
          hist.id === newHistory.id ? { ...hist, ...newHistory } : hist
        )
      );
      console.log("//////////////  UPDATE History /////////////", newHistory);
      console.log("///////////// histContext history /////////////", history);
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
