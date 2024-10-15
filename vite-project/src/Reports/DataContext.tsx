import React, { createContext, useContext, useState } from "react";

export interface DataInterface {
  chart: any[];
  table: any[];
  img: any[];
  keys: any[];
  src: any[];
  ts: Blob[]
}
interface DataContextProps {
  dataReport: DataInterface;
  addDataReport: (newData: any, reportType: string, keys: any, src: any[] ) => void;
  addTsData: (chunk: Blob) => void; // Função para adicionar pacotes ts
  clearDataReport: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataReport, setDataReport] = useState<DataInterface>({
    chart: [],
    table: [],
    img: [],
    keys: [],
    src: [],
    ts: [], // Inicializa ts como um array vazio
  });

  // Função para adicionar pacotes de dados gerais
  const addDataReport = (newData: any[], reportType: string, keys: any[], src: any[]) => {
    setDataReport((prevData) => {
      if (reportType === "sensor") {
        return { ...prevData, chart: newData, keys: keys, src: src };
      } else if (reportType === "table") {
        return { ...prevData, table: newData, keys: keys, src: src };
      } else if (reportType === "img") {
        return { ...prevData, img: newData, keys: keys, src: src };
      } else {
        return prevData;
      }
    });
  };

  // Função para adicionar pacotes .ts recebidos ao array de ts
  const addTsData = (chunk: Blob) => {
    setDataReport((prevData) => {
      return { ...prevData, ts: [...prevData.ts, chunk] }; // Adiciona novos pacotes ts ao array existente
    });
    console.log('Context Video', dataReport.ts)
  };
  
  // Função para limpar o estado
  const clearDataReport = () => {
    setDataReport({ chart: [], table: [], img: [], keys: [], src: [], ts: [] });
  };

  return (
    <DataContext.Provider
      value={{ dataReport, addDataReport, addTsData, clearDataReport }}
    >
      {children}
    </DataContext.Provider>
  );
};
