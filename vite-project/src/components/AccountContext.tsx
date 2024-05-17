import { createContext, useContext, useState, useEffect } from 'react';

interface User {
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
}

interface AccountContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAdmin: boolean; // Adicione o contexto isAdmin
  isLogged: boolean; // Adicione o contexto isLogged
}

interface AccountProviderProps {
  children: React.ReactNode;
}

const AccountContext = createContext<AccountContextData | undefined>(undefined);

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);


    // Defina isAdmin e isLogged com base no estado do usuário
    const isAdmin = user?.isAdmin ?? false;
    const isLogged = Boolean(user);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    console.log('isAdmin AC:', isAdmin); // Imprima o valor de isAdmin sempre que ele mudar
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AccountContext.Provider value={{ user, setUser, isAdmin, isLogged  }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextData => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};