import React, { createContext, useState, useContext, ReactNode } from "react";

export interface PbxInterface {
  status: string;
}

export interface GoogleApiKeyInterface {
  id?: number;
  entry: string;
  value: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LicenseDetail {
  value: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LicenseActive {
  pbx: {
    total: number;
    used: number;
  };
  users: {
    total: number;
    used: number;
  };
  admins: {
    total: number;
    used: number;
  };
  online: {
    total: number;
    used: number;
  };
  gateways: {
    total: number;
    used: number;
  };
}

export interface License {
  status: string;
  licenseKey: LicenseDetail;
  licenseFile: LicenseDetail;
  licenseActive: LicenseActive;
  licenseInstallDate: string | null;
}

interface AppConfigContextType {
  pbxStatus: PbxInterface[];
  apiKeyInfo: GoogleApiKeyInterface[];
  licenseApi: License;
  setPbxStatus: React.Dispatch<React.SetStateAction<PbxInterface[]>>;
  setApiKeyInfo: React.Dispatch<React.SetStateAction<GoogleApiKeyInterface[]>>;
  setLicense: React.Dispatch<React.SetStateAction<License>>;
  addPbx: (pbx: PbxInterface) => void;
  addApiKey: (apiKey: GoogleApiKeyInterface) => void;
  updateLicense: (
    licenseKey: string,
    licenseFile: string,
    licenseActive: LicenseActive,
    licenseInstallDate: string | null
  ) => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const [pbxStatus, setPbxStatus] = useState<PbxInterface[]>([]);
  const [apiKeyInfo, setApiKeyInfo] = useState<GoogleApiKeyInterface[]>([]);
  const [licenseApi, setLicense] = useState<License>({
    status: "active",
    licenseKey: { value: "", createdAt: null, updatedAt: null },
    licenseFile: { value: "", createdAt: null, updatedAt: null },
    licenseActive: { pbx: { total: 0, used: 0 }, users: { total: 0, used: 0 }, admins: { total: 0, used: 0 }, online: { total: 0, used: 0 }, gateways: { total: 0, used: 0 } },
    licenseInstallDate: null,
  });

  const addPbx = (pbx: PbxInterface) => {
    setPbxStatus((prevPbxInfo) => [...prevPbxInfo, pbx]);
  };

  const addApiKey = (apiKey: GoogleApiKeyInterface) => {
    setApiKeyInfo((prevApiKeys) => [...prevApiKeys, apiKey]);
  };

  const updateLicense = (
    licenseKey: string,
    licenseFile: string,
    licenseActive: LicenseActive,
    licenseInstallDate: string | null
  ) => {
    setLicense({
      status: "active",
      licenseKey: { value: licenseKey, createdAt: null, updatedAt: null },
      licenseFile: { value: licenseFile, createdAt: null, updatedAt: null },
      licenseActive,
      licenseInstallDate,
    });
  };

  console.log("CONTEXT LICENSE", licenseApi);

  return (
    <AppConfigContext.Provider
      value={{
        pbxStatus,
        apiKeyInfo,
        licenseApi,
        setPbxStatus,
        setApiKeyInfo,
        setLicense,
        addPbx,
        addApiKey,
        updateLicense,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = (): AppConfigContextType => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error("useAppConfig must be used within an AppConfigProvider");
  }
  return context;
};