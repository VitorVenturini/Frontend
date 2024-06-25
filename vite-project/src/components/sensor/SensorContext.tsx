import React, { createContext, useState, useContext, ReactNode } from "react";

export interface SensorInterface {
  id?: string;
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
  magnet_status: string;
  date?: string;
  isBoolean?: boolean;
}

interface SensorContextType {
  sensors: SensorInterface[];
  setSensors: React.Dispatch<React.SetStateAction<SensorInterface[]>>;
  updateSensor: (sensor: SensorInterface) => void;
  replaceLatestSensor: (sensor: SensorInterface) => void;
  clearSensorsByName: (sensorName: string) => void;
  addSensors: (sensors: SensorInterface[]) => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
  const [sensors, setSensors] = useState<SensorInterface[]>([]);

  const addSensors = (newSensors: SensorInterface[]) => {
    setSensors((prevSensors) => {
      const sensorMap = new Map(
        prevSensors.map((sensor) => [sensor.sensor_name + sensor.date, sensor])
      );

      newSensors.forEach((sensor) => {
        sensorMap.set(sensor.sensor_name + sensor.date, sensor);
      });
      console.log("Contexto Atualizado");
      return Array.from(sensorMap.values());
    });
  };

  const updateSensor = (sensor: SensorInterface) => {
    setSensors((prevSensors) => {
      const existingSensorIndex = prevSensors.findIndex(
        (s) => s.sensor_name === sensor.sensor_name
      );

      if (existingSensorIndex !== -1) {
        // Sensor já existe na lista, vamos comparar os valores
        const existingSensor = prevSensors[existingSensorIndex];

        // Verificar se algum valor do sensor atual é diferente do sensor existente
        const isDifferent = Object.keys(sensor).some(
          (key) =>
            existingSensor[key as keyof SensorInterface] !==
            sensor[key as keyof SensorInterface]
        );

        if (isDifferent) {
          // Se houver diferença, adicionamos o novo sensor no início da lista
          const updatedSensors = [
            sensor,
            ...prevSensors,
          ];
          return updatedSensors;
        } else {
          // Não há diferença, retornamos a lista sem alterações
          return prevSensors;
        }
      } else {
        // Sensor não existe na lista, adicionamos no início
        const updatedSensors = [sensor, ...prevSensors];
        return updatedSensors;
      }
    });
  };

  const replaceLatestSensor = (sensor: SensorInterface) => {
    setSensors((prevSensors) => {
      const sensorIndex = prevSensors.findIndex(
        (s) => s.sensor_name === sensor.sensor_name
      );
      if (sensorIndex !== -1) {
        const updatedSensors = [...prevSensors];
        updatedSensors[sensorIndex] = sensor;
        return updatedSensors;
      } else {
        return [...prevSensors, sensor];
      }
    });
  };

  const clearSensorsByName = (sensorName: string) => {
    setSensors((prevSensors) =>
      prevSensors.filter((sensor) => sensor.sensor_name !== sensorName)
    );
  };

  return (
    <SensorContext.Provider
      value={{
        sensors,
        setSensors,
        updateSensor,
        replaceLatestSensor,
        clearSensorsByName,
        addSensors,
      }}
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
