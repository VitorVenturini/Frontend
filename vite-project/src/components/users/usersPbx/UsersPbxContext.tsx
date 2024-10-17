import React, { createContext, useState, useContext, ReactNode } from "react";

export interface DeviceInterface {
  hw: string;
  text?: string;
  app?: string;
  state?: string;
  tls?: boolean;
  trusted?: boolean;
}

export interface UserPbxInterface {
  id: number;
  cn: string;
  guid: string;
  email: string;
  sip: string;
  e164: string;
  devices: DeviceInterface[];
  password?: string;
  createdAt?: string; // o ? significa que o valor nao precisa ser presente, se for nulo nao tem problema
  updatedAt?: string;
  type?: string;
  status?: string;
  note?: string;
  color?: string;
}

interface UserPbxContextType {
  usersPbx: UserPbxInterface[];
  setUsersPbx: React.Dispatch<React.SetStateAction<UserPbxInterface[]>>;
  addUsersPbx: (user: UserPbxInterface) => void;
  updateUserDevices : (devices: DeviceInterface[], guid: string) => void;
  updateUserPbx: (user: UserPbxInterface) => void;
  updateUserPbxStauts: (guid: string, status: string, note?: string) => void;
  deleteUserPbx: (id: number) => void;
}

const userPbxContext = createContext<UserPbxContextType | undefined>(undefined);

export const UserPbxProvider = ({ children }: { children: ReactNode }) => {
  const [usersPbx, setUsersPbx] = useState<UserPbxInterface[]>([]);

  const addUsersPbx = (user: UserPbxInterface) => {
    setUsersPbx((prevUsers) => [...prevUsers, user]);
  };
  const updateUserPbx = (updatedUser: UserPbxInterface) => {
    setUsersPbx((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

 const updateUserDevices = (newDevices: DeviceInterface[], guid: string) => {
  setUsersPbx((prevUsers) =>
    prevUsers.map((user) => {
      if (user.guid === guid) {
        // Filtrar os dispositivos que já existem com base no hw
        const filteredDevices = user?.devices?.filter((newDevice) =>
          newDevices.some((device) => device.hw === newDevice.hw)
        );
        // Retornar o usuário atualizado com os dispositivos filtrados
        return { ...user, devices: filteredDevices };
      }
      return user;
    })
  );
};

  const updateUserPbxStauts = (guid: string, status: string, note?: string) => {
    setUsersPbx((prevUsers) =>
      prevUsers.map((user) =>
        user.guid === guid ? { ...user, status, note } : user
      )
    );
  };
  const deleteUserPbx = (id: number) => {
    setUsersPbx((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };
  return (
    <userPbxContext.Provider
      value={{
        usersPbx,
        setUsersPbx,
        addUsersPbx,
        updateUserPbx,
        updateUserPbxStauts,
        deleteUserPbx,
        updateUserDevices
      }}
    >
      {children}
    </userPbxContext.Provider>
  );
};

export const useUsersPbx = (): UserPbxContextType => {
  const context = useContext(userPbxContext);
  if (context === undefined) {
    throw new Error("useUsersPbx must be used within a UserPbxProvider");
  }
  return context;
};
