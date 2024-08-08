import React, { createContext, useContext, useState } from "react";

export interface DataInterface {
  chart: any[];
  table: any[];
  keys: any[];
  src: any[];
}

interface DataContextProps {
  dataReport: DataInterface;
  addDataReport: (newData: any, reportType: string, keys: any, src: any[] ) => void;
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
    keys: [],
    src: [],
  });

  const addDataReport = (newData: any[], reportType: string, keys: any[], src: any[]) => {
    setDataReport((prevData) => {
      if (reportType === "sensor") {
        return { ...prevData, chart: newData, keys: keys, src: src };
      } else if (reportType === "table") {
        return { ...prevData, table: newData, keys: keys, src: src };
      } else {
        return prevData;
      }
    });
  };

  const clearDataReport = () => {
    setDataReport({ chart: [], table: [], keys: [], src:[] });
  };

  return (
    <DataContext.Provider
      value={{ dataReport, addDataReport, clearDataReport }}
    >
      {children}
    </DataContext.Provider>
  );
};
