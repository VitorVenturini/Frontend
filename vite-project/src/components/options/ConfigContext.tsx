import React, { createContext, useState, useContext, ReactNode } from "react";

// Definição de LoaderBarProps para o estado do LoaderBar
export interface LoaderBarProps {
  total: number;
  unitValue: number;
}

export interface PbxInterface {
  id?: number;
  entry?: string;
  value?: string;
  status?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
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

export interface NotificationsInterface {
  id?: number;
  entry: string;
  value: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}
export interface BackupConfig {
  backupUsername:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  backupPassword:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }

  backupPath:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  backupHost:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  backupFrequency:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;

  }
  backupHour:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  backupDay:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  backupMethod:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }

}

export interface SmtpConfig {
  smtpUsername:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  smtpPassword:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  smtpHost:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  smtpPort:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  smtpSecure:{
    entry: string;
    value: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
}

interface AppConfigContextType {
  pbxStatus: PbxInterface[];
  apiKeyInfo: GoogleApiKeyInterface[];
  licenseApi: License;
  loadBarData: LoaderBarProps;
  backupConfig: BackupConfig;
  smtpConfig: SmtpConfig;
  notification: NotificationsInterface[];
  addNotifications: (notification: NotificationsInterface) => void;
  updateNotification : (entry: string, newValue: string) => void;
  setPbxStatus: React.Dispatch<React.SetStateAction<PbxInterface[]>>;
  setApiKeyInfo: React.Dispatch<React.SetStateAction<GoogleApiKeyInterface[]>>;
  setLicense: React.Dispatch<React.SetStateAction<License>>;
  setLoadBarData: React.Dispatch<React.SetStateAction<LoaderBarProps>>;
  addPbx: (pbx: PbxInterface) => void;
  addApiKey: (apiKey: GoogleApiKeyInterface) => void;
  updateLicense: (
    licenseKey: string,
    licenseFile: string,
    licenseActive: LicenseActive,
    licenseInstallDate: string | null
  ) => void;
  clearPbxStatus: () => void;
  clearApiKeyInfo: () => void;
  clearLicense: () => void;
  clearLoadBarData: () => void;
  addBackupConfig: (backupConfig: BackupConfig) => void;
  clearBackupConfig: () => void;
  addSmtpConfig: (smtpConfig: SmtpConfig) => void;
  clearSmtpConfig: () => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const [pbxStatus, setPbxStatus] = useState<PbxInterface[]>([]);
  const [apiKeyInfo, setApiKeyInfo] = useState<GoogleApiKeyInterface[]>([]);
  const [notification, setNotifications] = useState<NotificationsInterface[]>([]);
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    backupUsername: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupPassword: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupPath: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupHost: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupFrequency: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupHour: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupDay: { entry: "", value: "", createdAt: null, updatedAt: null },
    backupMethod: { entry: "", value: "", createdAt: null, updatedAt: null },
  });
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    smtpUsername: { entry: "", value: "", createdAt: null, updatedAt: null },
    smtpPassword: { entry: "", value: "", createdAt: null, updatedAt: null },
    smtpHost: { entry: "", value: "", createdAt: null, updatedAt: null },
    smtpPort: { entry: "", value: "", createdAt: null, updatedAt: null },
    smtpSecure: { entry: "", value: '', createdAt: null, updatedAt: null },
  });
  const [licenseApi, setLicense] = useState<License>({
    status: "active",
    licenseKey: { value: "", createdAt: null, updatedAt: null },
    licenseFile: { value: "", createdAt: null, updatedAt: null },
    licenseActive: {
      pbx: { total: 0, used: 0 },
      users: { total: 0, used: 0 },
      admins: { total: 0, used: 0 },
      online: { total: 0, used: 0 },
      gateways: { total: 0, used: 0 },
    },
    licenseInstallDate: null,
  });

  const [loadBarData, setLoadBarData] = useState<LoaderBarProps>({
    total: 0,
    unitValue: 0,
  });

  // Funções para limpar/clearar o estado

  const clearPbxStatus = () => setPbxStatus([]);
  const clearApiKeyInfo = () => setApiKeyInfo([]);
  const clearLicense = () =>
    setLicense({
      status: "active",
      licenseKey: { value: "", createdAt: null, updatedAt: null },
      licenseFile: { value: "", createdAt: null, updatedAt: null },
      licenseActive: {
        pbx: { total: 0, used: 0 },
        users: { total: 0, used: 0 },
        admins: { total: 0, used: 0 },
        online: { total: 0, used: 0 },
        gateways: { total: 0, used: 0 },
      },
      licenseInstallDate: null,
    });
  const clearLoadBarData = () => setLoadBarData({ total: 0, unitValue: 0 });

  const addPbx = (pbx: PbxInterface) => {
    setPbxStatus((prevPbxStatus) => {
      const existingEntryIndex = prevPbxStatus.findIndex(
        (entry) => entry.entry === pbx.entry
      );

      if (existingEntryIndex !== -1) {
        const updatedPbxStatus = [...prevPbxStatus];
        updatedPbxStatus[existingEntryIndex] = { ...pbx };
        return updatedPbxStatus;
      } else {
        return [...prevPbxStatus, pbx];
      }
    });
  };
  
  const updateNotification = (entry: string, newValue: string) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.entry === entry
          ? { ...notification, value: newValue } 
          : notification
      );
      return updatedNotifications;
    });
  };

  const addNotifications = (notification: NotificationsInterface) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
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
  const addBackupConfig = (newBackupConfig: BackupConfig) => {
    setBackupConfig((prevBackupConfig) => ({
      ...prevBackupConfig,
      ...newBackupConfig,
    }));
};

  const clearBackupConfig = () => {
    setBackupConfig({
      backupUsername: { entry: "backupUsername", value: "", createdAt: null, updatedAt: null },
      backupPassword: { entry: "backupPassword", value: "", createdAt: null, updatedAt: null },
      backupPath: { entry: "backupPath", value: "", createdAt: null, updatedAt: null },
      backupHost: { entry: "backupHost", value: "", createdAt: null, updatedAt: null },
      backupFrequency: { entry: "backupFrequency", value: "", createdAt: null, updatedAt: null },
      backupHour: { entry: "backupHour", value: "", createdAt: null, updatedAt: null },
      backupDay: { entry: "backupDay", value: "", createdAt: null, updatedAt: null },
      backupMethod: { entry: "backupMethod", value: "", createdAt: null, updatedAt: null },
    });
  };
  const addSmtpConfig = (newSmtpConfig: SmtpConfig) => {
    setSmtpConfig((prevSmtpConfig) => ({
      ...prevSmtpConfig,
      ...newSmtpConfig,
    }));
}
const clearSmtpConfig = () => {
  setSmtpConfig({
    smtpUsername: { entry: "smtpUsername", value: "", createdAt: null, updatedAt: null },
    smtpPassword: { entry: "smtpPassword", value: "", createdAt: null, updatedAt: null },
    smtpHost: { entry: "smtpHost", value: "", createdAt: null, updatedAt: null },
    smtpPort: { entry: "smtpPort", value: "", createdAt: null, updatedAt: null },
    smtpSecure: { entry: "smtpSecure", value: '', createdAt: null, updatedAt: null },
  });
};

  return (
    <AppConfigContext.Provider
      value={{
        pbxStatus,
        apiKeyInfo,
        licenseApi,
        loadBarData,
        notification,
        backupConfig,
        smtpConfig,
        setPbxStatus,
        addNotifications,
        updateNotification,
        setApiKeyInfo,
        setLicense,
        setLoadBarData,
        addPbx,
        addApiKey,
        updateLicense,
        clearPbxStatus,
        clearApiKeyInfo,
        clearLicense,
        clearLoadBarData,
        addBackupConfig,
        clearBackupConfig,
        addSmtpConfig,
        clearSmtpConfig,
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
