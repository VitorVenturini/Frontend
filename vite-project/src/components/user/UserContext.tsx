// {
//     "id": "36",
//     "name": "Erick",
//     "guid": "5918469579912990686",
//     "email": "erick@wecom.com.br",
//     "sip": "wecom.com.br",
//     "password": "$2a$15$3M7moib1NAdK.lfe27qBkeb9gIS.iyMlAVCsA/Imqi15soNtJsMCO",
//     "createdAt": "2024-06-04 12:35:00.000 +00:00",
//     "updatedAt": "2024-06-04 12:35:51.658 +00:00",
//     "type": "admin"
// }

import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserInterface {
  id: number;
  name: string;
  guid: string;
  email: string;
  sip: string;
  password: string;
  createdAt?: string; // o ? significa que o valor nao precisa ser presente , se for nulo nao tem problema
  updatedAt?: string;
  type?: string;
  status?: string;
}

interface UserContextType {
  users: UserInterface[];
  setUsers: React.Dispatch<React.SetStateAction<UserInterface[]>>;
  addUsers: (user: UserInterface) => void;
  updateUser: (user: UserInterface) => void;
}

const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  const addUsers = (user: UserInterface) => {
    setUsers((prevUsers) => [...prevUsers, user]);
    console.log("Atualizou o contexto")
  };

  const updateUser = (updatedUser: UserInterface) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  //   const deleteUser = (id: number) => {
  //     setUsers((prevUsers) =>
  //         prevUsers.filter((user) => user.id !== id)
  //     );
  //   };

  return (
    <userContext.Provider
      value={{
        users,
        setUsers,
        addUsers,
        updateUser,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUsers = (): UserContextType => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
