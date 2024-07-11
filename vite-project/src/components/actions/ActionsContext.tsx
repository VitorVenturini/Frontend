import React, { createContext, useState, useContext, ReactNode } from "react";
import Actions from "@/pages/admin/Actions";
export interface ActionsInteface {
  id: string;
  action_name: string;
  action_start_prt: string;
  action_start_type: string;
  action_start_device_parameter?: string | null;
  action_start_device?: string | null;
  action_exec_user?: string ;
  action_exec_type?: string | null;
  action_exec_type_command_mode?: string| null;
  action_exec_prt?: string | null;
  action_exec_device?: string ;
  createdAt: string;
  create_user: string;
  updatedAt: string;
}

interface ActionsIntefaceType {
  actions: ActionsInteface[];
  setActions: React.Dispatch<React.SetStateAction<ActionsInteface[]>>;
  addActions: (action: ActionsInteface) => void;
  updateActions: (action: ActionsInteface) => void;
  deleteAction: (id: string) => void;
  clearActions: () => void;
}
const ActionsContext = createContext<ActionsIntefaceType | undefined>(
  undefined
);

export const ActionProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<ActionsInteface[]>([]);

  const addActions = (action: ActionsInteface) => {
    setActions((prevActions) => [...prevActions, action]);
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
      value={{ actions, setActions, addActions, clearActions, deleteAction, updateActions }}
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
