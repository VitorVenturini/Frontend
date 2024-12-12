import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserPreferencesInterface {
  guid: string;
  pages: userPages[];
}
export interface userPages {
  pageNumber: number;
  pageName: string | null;
}
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
  userPreferences?: UserPreferencesInterface;
}

interface UserContextType {
  users: UserInterface[];
  setUserPreferences: (preferences: UserPreferencesInterface) => void;
  setUserPages: (guid: string, pages: userPages[]) => void;
  setUsers: React.Dispatch<React.SetStateAction<UserInterface[]>>;
  addUsers: (user: UserInterface) => void;
  updateUser: (user: UserInterface) => void;
  updateUserStauts: (guid: string, status: string, note?: string) => void;
  //onlineUsers: (guid: string) => void;
  deleteUser: (id: number) => void;
}

const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  const addUsers = (user: UserInterface) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const setUserPreferences = (preferences: UserPreferencesInterface) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        String(user.guid) === String(preferences.guid)
          ? { ...user, userPreferences: { ...preferences } }
          : user
      )
    );
  };
  const setUserPages = (guid: string, pages: userPages[]) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.guid === guid
          ? {
              ...user,
              userPreferences: {
                ...user.userPreferences, // Preserva outras propriedades de userPreferences
                pages,
              },
            }
          : user
      )
    );
  };
  console.log("contextUserPreferences", users);
  const updateUser = (updatedUser: UserInterface) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };
  const updateUserStauts = (guid: string, status: string, note?: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.guid === guid ? { ...user, status, note } : user
      )
    );
  };
  // const onlineUsers = (guid: string) => {
  //   setUsers(() => )
  // }
  const deleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };
  return (
    <userContext.Provider
      value={{
        users,
        setUsers,
        setUserPreferences,
        addUsers,
        setUserPages,
        updateUser,
        updateUserStauts,
        //onlineUsers,
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
