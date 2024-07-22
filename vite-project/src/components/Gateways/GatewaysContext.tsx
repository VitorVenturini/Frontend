import React, { createContext, useState, useContext, ReactNode } from "react";


export interface GatewaysInterface {
  id: string;
  host: string;
  nickname: string;
  userapi: string;
  password: string;
  createdAt: string;
  create_user: string;
  updatedAt: string;
}

interface GatewaysInterfaceType {
  gateways: GatewaysInterface[];
  setGateways: React.Dispatch<React.SetStateAction<GatewaysInterface[]>>;
  addGateway: (gateway: GatewaysInterface) => void;
  updateGateway: (gateway: GatewaysInterface) => void;
  deleteGateway: (id: string) => void;
  clearGateways: () => void;
}

const GatewaysContext = createContext<GatewaysInterfaceType | undefined>(
  undefined
);
export const GatewayProvider = ({ children }: { children: ReactNode }) => {
  const [gateways, setGateways] = useState<GatewaysInterface[]>([]);
  
  const addGateway = (gateway: GatewaysInterface) => {
    setGateways((prevGateways) => [...prevGateways, gateway]);
  };

  const updateGateway = (updatedGateway: GatewaysInterface) => {
    setGateways((prevGateways) =>
      prevGateways.map((gateway) =>
        gateway.id === updatedGateway.id
          ? { ...gateway, ...updatedGateway }
          : gateway
      )
    );
  };

  const clearGateways = () => {
    setGateways([]);
  };

  const deleteGateway = (id: string) => {
    setGateways((prevGateways) =>
      prevGateways.filter((gateway) => gateway.id !== id)
    );
  };
  console.log("GatewaysContext Gateways", gateways);
  return (
    <GatewaysContext.Provider
      value={{
        gateways,
        setGateways,
        addGateway,
        clearGateways,
        deleteGateway,
        updateGateway,
      }}
    >
      {children}
    </GatewaysContext.Provider>
  );
};

export const useGateways = (): GatewaysInterfaceType => {
  const context = useContext(GatewaysContext);
  if (context === undefined) {
    throw new Error("useGateways must be used within a GatewayProvider");
  }

  return context;
};
