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
  oldValue?: number; // propriedade adicional para sensores
  newValue?: number; // propriedade adicional para sensores
  clicked?: boolean; // adicionado para rastrear se o botão foi clicado
  triggered: boolean;
  commandValue?: string;
  comboStart?: boolean;
}

interface ButtonContextType {
  buttons: ButtonInterface[];
  setButtons: React.Dispatch<React.SetStateAction<ButtonInterface[]>>;
  addButton: (button: ButtonInterface) => void;
  updateButton: (button: ButtonInterface) => void;
  setOldValue: (
    sensorType: string,
    sensorName: string,
    value: number | undefined
  ) => void;
  setNewValue: (
    sensorType: string,
    sensorName: string,
    value: number | undefined
  ) => void;
  setClickedButton: (id: number) => void;
  removeClickedButton: (id: number) => void;
  clearButtons: () => void;
  setButtonTriggered: (id: number, triggered: boolean) => void;
  setStopButtonTriggered: (alarm: string, triggered: boolean) => void;
  setCommandValue: (btn_id: number, prt: string, value: string) => void;
  comboStarted: (comboId: number) => void; 
  setStopCombo: (id: number) => void;
  deleteButton: (id: number) => void;
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

  const deleteButton = (id: number) => {
    setButtons((prevButtons) =>
      prevButtons.filter((button) => button.id !== id)
    );
  };

  const setOldValue = (
    sensorType: string,
    sensorName: string,
    value: number | undefined
  ) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.sensor_type === sensorType && button.button_prt === sensorName
          ? { ...button, oldValue: value }
          : button
      )
    );
  };

  const setCommandValue = (btn_id: number, prt: string, value: string) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === btn_id
          ? { ...button, button_prt: prt, commandValue: value }
          : button
      )
    );
  };
  const setNewValue = (
    sensorType: string,
    sensorName: string,
    value: number | undefined
  ) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.sensor_type === sensorType && button.button_prt === sensorName
          ? { ...button, newValue: value }
          : button
      )
    );
  };

  const setClickedButton = (id: number) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, clicked: true } : button
      )
    );
  };

  const removeClickedButton = (id: number) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, clicked: false } : button
      )
    );
  };

  const clearButtons = () => {
    setButtons([]);
  };

  const setButtonTriggered = (id: number, triggered: boolean) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, triggered } : button
      )
    );
  };

  const setStopButtonTriggered = (alarm: string, triggered: boolean) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        //&& button.button_user === guid  restrição para parar todos os botões
        button.button_prt === alarm ? { ...button, triggered } : button
      )
    );
  };

  const comboStarted = (comboId: number) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === comboId 
          ? { ...button, triggered: true, clicked: true, comboStart: true }
          : button
      )
    );
  };

  const setStopCombo = (id: number) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, comboStart: false } : button
      )
    );
  };


  return (
    <ButtonContext.Provider
      value={{
        buttons,
        setButtons,
        addButton,
        clearButtons,
        updateButton,
        deleteButton,
        setCommandValue,
        setOldValue,
        setNewValue,
        setClickedButton,
        removeClickedButton,
        setButtonTriggered,
        setStopButtonTriggered,
        comboStarted,
        setStopCombo
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
