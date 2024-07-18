import React, { createContext, useState, useContext, ReactNode } from "react";

export interface GoogleApiKeyInterface {
  id?: number;
  entry: string;
  value: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface GoogleApiKeyContextType {
  apiKeyInfo: GoogleApiKeyInterface[];
  setApiKeyInfo: React.Dispatch<React.SetStateAction<GoogleApiKeyInterface[]>>;
  addApiKey: (apiKey: GoogleApiKeyInterface) => void;
}

const GoogleApiKeyContext = createContext<GoogleApiKeyContextType | undefined>(undefined);

export const GoogleApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeyInfo, setApiKeyInfo] = useState<GoogleApiKeyInterface[]>([]);

  const addApiKey = (apiKey: GoogleApiKeyInterface) => {
    setApiKeyInfo((prevApiKeys) => [...prevApiKeys, apiKey]);
  };

  return (
    <GoogleApiKeyContext.Provider value={{ apiKeyInfo, setApiKeyInfo, addApiKey }}>
      {children}
    </GoogleApiKeyContext.Provider>
  );
};

export const useGoogleApiKey = (): GoogleApiKeyContextType => {
  const context = useContext(GoogleApiKeyContext);
  if (context === undefined) {
    throw new Error("useGoogleApiKey must be used within a GoogleApiKeyProvider");
  }
  return context;
};
