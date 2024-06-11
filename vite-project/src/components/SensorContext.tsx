import React, { createContext, useState, useContext, ReactNode } from "react";

export interface SensorInterface {
  id?: string; // Adiciona o id se for necessário
  sensor_name: string;
  battery?: string;
  co2?: string;
  humidity?: string;
  temperature?: string;
  leak?: string;
  pir?: string;
  light?: string;
  tvoc?: string;
  pressure?: string;
  date?: string;
}

interface SensorContextType {
  sensors: SensorInterface[];
  setSensors: React.Dispatch<React.SetStateAction<SensorInterface[]>>;
  updateSensor: (sensor: SensorInterface) => void;
  clearSensors: () => void;
  addSensors: (sensors: SensorInterface[]) => void; // Modificado para aceitar array de sensores
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
  const [sensors, setSensors] = useState<SensorInterface[]>([]);

  const addSensors = (newSensors: SensorInterface[]) => {
    setSensors((prevSensors) => {
      const updatedSensors = [...prevSensors];
      newSensors.forEach((sensor) => {
        const sensorIndex = updatedSensors.findIndex(
          (s) => s.sensor_name === sensor.sensor_name
        );
        if (sensorIndex !== -1) {
          // Substituir o sensor existente
          updatedSensors[sensorIndex] = sensor;
        } else {
          // Adicionar novo sensor
          updatedSensors.push(sensor);
        }
      });
      return updatedSensors;
    });
  };

  const updateSensor = (sensor: SensorInterface) => {
    setSensors((prevSensors) => {
      const sensorIndex = prevSensors.findIndex(
        (s) => s.sensor_name === sensor.sensor_name
      );
      if (sensorIndex !== -1) {
        // Atualizar o sensor existente
        const updatedSensors = [...prevSensors];
        updatedSensors[sensorIndex] = {
          ...updatedSensors[sensorIndex],
          ...sensor,
        };
        return updatedSensors;
      } else {
        // Adicionar novo sensor
        return [...prevSensors, sensor];
      }
    });
  };

  const clearSensors = () => {
    setSensors([]);
  };

  return (
    <SensorContext.Provider
      value={{ sensors, setSensors, updateSensor, clearSensors, addSensors }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = (): SensorContextType => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error("useSensors must be used within a SensorProvider");
  }
  return context;
};
