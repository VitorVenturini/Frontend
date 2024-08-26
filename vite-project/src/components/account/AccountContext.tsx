import { createContext, useContext, useState, useEffect } from "react";

interface Account {
  createdAt: string;
  email: string;
  guid: string;
  id: string;
  name: string;
  password: string;
  sip: string;
  type: string; //saber se é admin ou user
  updatedAt: string;
  accessToken: string;
  isAdmin: boolean; // pra saber se vai logar como admin ou user
  isLogged: boolean; // pra saber se está logado
  session: string;
}
export const initialState: Account = {
  createdAt: "",
  email: "",
  guid: "",
  id: "",
  name: "",
  password: "",
  sip: "",
  type: "",
  updatedAt: "",
  accessToken: "",
  isAdmin: false,
  isLogged: false,
  session: "",
};

type AccountContextData = Account & {
  updateAccount: (newAccountData: Partial<Account> | Account) => void;
};

interface AccountProviderProps {
  children: React.ReactNode;
}

export const AccountContext = createContext<AccountContextData>({
  ...initialState,
  updateAccount: () => {},
});

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {

  const [Account, setAccount] = useState<Account>(() => {
    const initialSession = localStorage.getItem("currentSession");
    if (initialSession) {
      const storedAccount = localStorage.getItem(initialSession);
      return storedAccount ? JSON.parse(storedAccount) : initialState;
    }
    return initialState;
  });

  useEffect(() => {
    if (Account.session) {
      localStorage.setItem("currentSession", Account.session); 
      localStorage.setItem(Account.session, JSON.stringify(Account)); 
    }
  }, [Account]);

  // Função para atualizar a conta
  const updateAccount = (newAccountData: Partial<Account> | Account) => {
    setAccount((prevAccount) => ({ ...prevAccount, ...newAccountData }));
  };
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
