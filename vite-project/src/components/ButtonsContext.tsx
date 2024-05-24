import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface ButtonInterface {
    id: string;
    button_name: string;
    button_prt: string;
    button_prt_user: string;
    button_user: string;
    button_type: string;
    button_type_1?: string | null;  // o ? significa que o valor nao precisa ser presente , se for nulo nao tem problema
    button_type_2?: string | null;
    button_type_3?: string | null;
    button_type_4?: string | null;
    button_device?: string;
    sensor_min_threshold?: string | null;
    sensor_max_threshold?: string | null;
    sensor_type?: string | null;
    create_user: string;
    page: string;
    position_x: string;
    position_y: string;
    img?: string | null;
    createdAt: string;
    updatedAt: string;
  }

interface ButtonContextType {
    buttons: ButtonInterface[];
    setButtons: React.Dispatch<React.SetStateAction<ButtonInterface[]>>;
    updateButton: (button: ButtonInterface) => void;
  }
  
  const ButtonContext = createContext<ButtonContextType | undefined>(undefined);
  
  export const ButtonProvider = ({ children }: { children: ReactNode }) => {
    const [buttons, setButtons] = useState<ButtonInterface[]>([]);

    const updateButton = (button: ButtonInterface) => {
      setButtons(prevButtons => [...prevButtons, button]);
    };

    return (
      <ButtonContext.Provider value={{ buttons, setButtons, updateButton }}>
        {children}
      </ButtonContext.Provider>
    );
  };
  
  export const useButtons = (): ButtonContextType => {
    const context = useContext(ButtonContext);
    if (context === undefined) {
      throw new Error('useButtons must be used within a ButtonProvider');
    }
    return context;
  };
