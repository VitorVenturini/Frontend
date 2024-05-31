import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface SensorInterface {
    sensor_name: string;
  }

interface SensorContextType {
    sensors: SensorInterface[];
    setSensors: React.Dispatch<React.SetStateAction<SensorInterface[]>>;
    updateSensor: (sensor: SensorInterface) => void;
  }
  
  const SensorContext = createContext<SensorContextType | undefined>(undefined);
  
  export const SensorProvider = ({ children }: { children: ReactNode }) => {
    const [sensors, setSensors] = useState<SensorInterface[]>([]);

    const updateSensor = (sensor: SensorInterface) => {
        setSensors(prevSensors => [...prevSensors, sensor]);
    };

    return (
      <SensorContext.Provider value={{ sensors, setSensors, updateSensor }}>
        {children}
      </SensorContext.Provider>
    );
  };
  
  export const useSensors = (): SensorContextType => {
    const context = useContext(SensorContext);
    if (context === undefined) {
      throw new Error('useSensors must be used within a SensorProvider');
    }
    return context;
  };
