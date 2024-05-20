import { createContext, useContext, useState, useEffect } from "react";

interface Account {
  createdAt: string;
  email: string;
  guid: string;
  id: string;
  name: string;
  password: string;
  sip: string;
  type: string;
  updatedAt: string;
  accessToken: string;
  isAdmin: boolean;
  isLogged: boolean;
}
export const initialState: Account = {
  createdAt: '',
  email: '',
  guid: '',
  id: '',
  name: '',
  password: '',
  sip: '',
  type: '',
  updatedAt: '',
  accessToken: '',
  isAdmin: false,
  isLogged: false,
};

type AccountContextData = Account & {
  updateAccount: (newAccountData: Partial<Account>) => void;
}

interface AccountProviderProps {
  children: React.ReactNode;
}

export const AccountContext = createContext<AccountContextData>({
  ...initialState,
  updateAccount: () => {},
});

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [Account, setAccount] = useState<Account>(initialState);

  // Função para atualizar a conta
  const updateAccount = (newAccountData: Partial<Account>) => {
    setAccount(prevAccount => ({ ...prevAccount, ...newAccountData }));
  }
  return (
    <AccountContext.Provider value={{ ...Account, updateAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextData => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
