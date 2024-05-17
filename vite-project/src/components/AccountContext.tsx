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
const initialState: Account = {
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

interface AccountContextData {
  Account: Account | null;
  isAdmin: boolean;
  setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
  updateUserContext: (user: Account) => void;
}

interface AccountProviderProps {
  children: React.ReactNode;
}

const AccountContext = createContext<AccountContextData | undefined>(undefined);

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [Account, setAccount] = useState<Account | null>(null);


  // Defina isAdmin e isLogged com base no estado do usuário
  const isAdmin = Account?.isAdmin ?? false;
  const isLogged = Boolean(Account);

  const updateAccountContext = (newAccount: Partial<Account>) => {
    const mergedAccount = Account ? { ...Account, ...newAccount } : newAccount as Account;
    setAccount(mergedAccount);
    if (newAccount) {
      localStorage.setItem('Account', JSON.stringify(mergedAccount));
    } else {
      localStorage.removeItem('Account');
    }
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem("Account");
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    }
  }, []);

  useEffect(() => {
    if (Account) {
      localStorage.setItem("Account", JSON.stringify(Account));
    } else {
      localStorage.removeItem("Account");
    }
  }, [Account]);
  useEffect(() => {
    console.log("isAdmin accountContext:", isAdmin); // Imprima o valor de isAdmin sempre que ele mudar
  }, [isAdmin]);

  return (
    <AccountContext.Provider value={{Account, setAccount, updateAccountContext }}>
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
