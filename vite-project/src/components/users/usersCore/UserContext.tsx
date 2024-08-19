
import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserInterface {
  id: number;
  name: string;
  guid: string;
  email: string;
  sip: string;
  device?: string;
  password?: string;
  createdAt?: string; // o ? significa que o valor nao precisa ser presente , se for nulo nao tem problema
  updatedAt?: string;
  type?: string;
  status?: string;
  note?: string;
  color?: string;
}

interface UserContextType {
  users: UserInterface[];
  setUsers: React.Dispatch<React.SetStateAction<UserInterface[]>>;
  addUsers: (user: UserInterface) => void;
  updateUser: (user: UserInterface) => void;
  updateUserStauts: (guid: string, status: string, note?: string) => void;
  deleteUser: (id: number) => void;
}

const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  const addUsers = (user: UserInterface) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };
  const updateUser = (updatedUser: UserInterface) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };
  const updateUserStauts = (guid: string, status: string, note?: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.guid === guid ? { ...user, status, note } : user))
    );
  };
  const deleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };
  return (
    <userContext.Provider
      value={{
        users,
        setUsers,
        addUsers,
        updateUser,
        updateUserStauts,
        deleteUser,
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
