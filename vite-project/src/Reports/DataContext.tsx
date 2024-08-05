import React, { createContext, useContext, useState } from 'react';

interface DataInterface {
  chart: any[];
  table: any[];
}

interface DataContextProps {
  dataReport: DataInterface;
  addDataReport: (newData: any, reportType: string) => void;
  clearDataReport: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataReport, setDataReport] = useState<DataInterface>({ chart: [], table: [] });

  const addDataReport = (newData: any, reportType: string) => {
    setDataReport((prevData) => {
      if (reportType === 'sensor') {
        return { ...prevData, chart: [...prevData.chart, ...newData] };
      } else if (reportType === 'table') {
        return { ...prevData, table: [...prevData.table, ...newData] };
      } else {
        return prevData;
      }
    });
  };

  const clearDataReport = () => {
    setDataReport({ chart: [], table: [] });
  };
  console.log('DATACONTEXT ', dataReport)
  return (
    <DataContext.Provider value={{ dataReport, addDataReport, clearDataReport }}>
      {children}
    </DataContext.Provider>
  );
};
