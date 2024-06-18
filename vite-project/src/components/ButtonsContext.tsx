import React, { createContext, useState, useContext, ReactNode } from "react";

export interface ButtonInterface {
  id: number;
  button_name: string;
  button_prt: string;
  button_prt_user: string;
  button_user: string;
  button_type: string;
  button_type_1?: string | null; // o ? significa que o valor nao precisa ser presente , se for nulo nao tem problema
  button_type_2?: string | null;
  button_type_3?: string | null;
  button_type_4?: string | null;
  button_device?: string;
  sensor_min_threshold?: string;
  sensor_max_threshold?: string;
  sensor_type?: string | null;
  create_user: string;
  page: string;
  position_x: string;
  position_y: string;
  img?: string | null;
  createdAt: string;
  updatedAt: string;
  oldValue?: number; // Adicionar oldValue como campo opcional
  newValue?: number; // Adicionar newValue como campo opcional
}

interface ButtonContextType {
  buttons: ButtonInterface[];
  setButtons: React.Dispatch<React.SetStateAction<ButtonInterface[]>>;
  addButton: (button: ButtonInterface) => void;
  updateButton: (button: ButtonInterface) => void;
  setOldValue: (sensorType: string, sensorName: string, value: number | undefined) => void;
  setNewValue: (sensorType: string, sensorName: string, value: number | undefined) => void;
  clearButtons: () => void;
}

const ButtonContext = createContext<ButtonContextType | undefined>(undefined);

export const ButtonProvider = ({ children }: { children: ReactNode }) => {
  const [buttons, setButtons] = useState<ButtonInterface[]>([]);

  const addButton = (button: ButtonInterface) => {
    setButtons((prevButtons) => [...prevButtons, button]);
  };

  const updateButton = (updatedButton: ButtonInterface) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === updatedButton.id
          ? { ...button, ...updatedButton }
          : button
      )
    );
  };
  const setOldValue = (sensorType: string, sensorName: string, value: number | undefined) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.sensor_type === sensorType && button.button_prt === sensorName
          ? { ...button, oldValue: value }
          : button
      )
    );
  };
  
  const setNewValue = (sensorType: string, sensorName: string, value: number | undefined) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.sensor_type === sensorType && button.button_prt === sensorName
          ? { ...button, newValue: value }
          : button
      )
    );
  };
  
  const clearButtons = () => {
    setButtons([]);
  };

  return (
    <ButtonContext.Provider
      value={{
        buttons,
        setButtons,
        addButton,
        clearButtons,
        updateButton,
        setOldValue,
        setNewValue,
      }}
    >
      {children}
    </ButtonContext.Provider>
  );
};

export const useButtons = (): ButtonContextType => {
  const context = useContext(ButtonContext);
  if (context === undefined) {
    throw new Error("useButtons must be used within a ButtonProvider");
  }
  return context;
};
