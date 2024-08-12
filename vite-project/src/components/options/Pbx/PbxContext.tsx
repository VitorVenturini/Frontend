import React, { createContext, useState, useContext, ReactNode } from "react";

export interface PbxInterface {
  id?: number;
  entry: string;
  value: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface PbxContextType {
  pbxInfo: PbxInterface[];
  setPbxInfo: React.Dispatch<React.SetStateAction<PbxInterface[]>>;
  addPbx: (pbx: PbxInterface) => void;
}

const PbxContext = createContext<PbxContextType | undefined>(undefined);

export const PbxProvider = ({ children }: { children: ReactNode }) => {
  const [pbxInfo, setPbxInfo] = useState<PbxInterface[]>([]);

  const addPbx = (pbx: PbxInterface) => {
    setPbxInfo((prevPbxInfo) => [...prevPbxInfo, pbx]);
  };

  return (
    <PbxContext.Provider value={{ pbxInfo, setPbxInfo, addPbx }}>
      {children}
    </PbxContext.Provider>
  );
};

export const usePbx = (): PbxContextType => {
  const context = useContext(PbxContext);
  if (context === undefined) {
    throw new Error("usePbx must be used within a PbxProvider");
  }
  return context;
};
