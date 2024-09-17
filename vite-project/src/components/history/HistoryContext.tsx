import { createContext, useState, useContext, ReactNode } from "react";

export interface HistoryInterface {
  message: string; // campo para mensagem personalizada
  date: string;
  type: string;
  muted?: boolean;
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
    // Verifica se já existe uma entrada com a mesma mensagem e data
    const isDuplicate = history.some(
      (hist) =>
        hist.message === newHistory.message &&
        hist.date === newHistory.date
    );

    // Só adiciona se não for duplicado
    if (!isDuplicate) {
      setHistoryState((prevHistory) => [newHistory, ...prevHistory]);
    }
  };

  // const updateHistory = (updatedHistory: HistoryInterface) => {
  //   setHistoryState((prevHistory) =>
  //     prevHistory.map((hist) =>
  //       hist.button_name === updatedHistory.button_name
  //         ? { ...hist, ...updatedHistory }
  //         : hist
  //     )
  //   );
  // };

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
