import { createContext, useState, useContext, ReactNode } from "react";

export interface HistoryInterface {
  id: string;
  guid: string;
  from: string;
  name: string;
  date: string;
  status: string;
  prt: string;
  details: string;
}

interface HistoryContextType {
  history: HistoryInterface[];
  addHistory: (newHistory: HistoryInterface) => void;
 // updateHistory: (updatedHistory: HistoryInterface) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistoryState] = useState<HistoryInterface[]>([]);

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
