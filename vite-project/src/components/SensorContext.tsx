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
      console.log("UpdateSensorContext"); // Este log deve aparecer quando a função é chamada

      // Verifica se o sensor já existe na lista
      const sensorIndex = prevSensors.findIndex(
        (s) => s.sensor_name === sensor.sensor_name
      );

      if (sensorIndex !== -1) {
        // Atualizar apenas o último registro do sensor
        const updatedSensors = [...prevSensors];
        const sensorHistory = updatedSensors.filter(
          (s) => s.sensor_name === sensor.sensor_name
        );
        if (sensorHistory.length > 0) {
          const lastIndex = updatedSensors.lastIndexOf(
            sensorHistory[sensorHistory.length - 1]
          );

          // Verifica se o valor do sensor mudou
          const lastSensor = updatedSensors[lastIndex];
          const isDifferent = Object.keys(sensor).some(
            (key) => (sensor as any)[key] !== (lastSensor as any)[key]
          );

          if (isDifferent) {
            updatedSensors[lastIndex] = {
              ...updatedSensors[lastIndex],
              ...sensor,
            };
            return updatedSensors;
          } else {
            // Retorna a lista não alterada se os valores não mudaram
            return prevSensors;
          }
        } else {
          return [sensor, ...updatedSensors];
        }
      } else {
        // Adicionar o novo sensor no início da lista
        return [sensor, ...prevSensors];
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
