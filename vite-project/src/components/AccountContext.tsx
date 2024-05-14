import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  createdAt: string;
  email: string;
  guid: string;
  id: string;
  name: string;
  password: string;
  sip: string;
  type: string;
  updatedAt: string;
}

interface AccountContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
interface AccountProviderProps {
    children: React.ReactNode;
  }
  

const AccountContext = createContext<AccountContextData | undefined>(undefined);

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user',);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);
    
      useEffect(() => {
        console.log('User updated:', user);
      }, [user]);
  
    return (
      <AccountContext.Provider value={{ user, setUser }}>
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