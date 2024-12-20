import React, { createContext, useState, useContext, ReactNode } from "react";
import { useWebSocketData } from "../websocket/WebSocketProvider";
export interface ActionsInteface {
  id: string;
  action_name: string;
  action_start_prt: string;
  action_start_type: string;
  action_start_device_parameter?: string | null;
  action_start_device?: string | null;
  action_exec_user?: string;
  action_exec_type?: string | null;
  action_exec_type_command_mode?: string | null;
  action_exec_prt?: string | null;
  action_exec_device?: string;
  createdAt: string;
  create_user: string;
  updatedAt: string;
  notifications: any[];
}

interface ActionsIntefaceType {
  actions: ActionsInteface[];
  setActions: React.Dispatch<React.SetStateAction<ActionsInteface[]>>;
  addActions: (action: ActionsInteface) => void;
  updateNotifications: (actionId: string, notifications: any[]) => void;
  updateActions: (action: ActionsInteface) => void;
  deleteAction: (id: string) => void;
  clearActions: () => void;
}
const ActionsContext = createContext<ActionsIntefaceType | undefined>(
  undefined
);

export const ActionProvider = ({ children }: { children: ReactNode }) => {
  const wss = useWebSocketData();
  const [actions, setActions] = useState<ActionsInteface[]>([]);

  const addActions = (action: ActionsInteface) => {
    setActions((prevActions) => [...prevActions, action]);
  };

  const updateNotifications = (actionId: string, notifications: any[]) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.id === actionId
          ? { ...action, notifications: notifications } // Limpa e atualiza
          : action
      )
      
    );
    console.log('ActionContext updateNotify', actions)
  };
  const updateActions = (updatedAction: ActionsInteface) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.id === updatedAction.id
          ? { ...action, ...updatedAction }
          : action
      )
    );
  };

  const clearActions = () => {
    setActions([]);
  };

  const deleteAction = (id: string) => {
    setActions((prevActions) =>
      prevActions.filter((action) => action.id !== id)
    );
  };
  console.log("ACTIONCONTEXT actions", actions);
  return (
    <ActionsContext.Provider
      value={{
        actions,
        updateNotifications,
        setActions,
        addActions,
        clearActions,
        deleteAction,
        updateActions,
      }}
    >
      {children}
    </ActionsContext.Provider>
  );
};

export const useActions = (): ActionsIntefaceType => {
  const context = useContext(ActionsContext);
  if (context === undefined) {
    throw new Error("useactions must be used within a actionProvider");
  }
  return context;
};
