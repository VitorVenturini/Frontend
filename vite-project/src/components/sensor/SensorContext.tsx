import React, { createContext, useState, useContext, ReactNode } from "react";

export interface SensorInterface {
    id?: string;
    sensor_name: string;
    deveui?: string;
    battery?: string;
    co2?: string;
    description? : string;
    gateway_id: string;
    parameters: any[];
    humidity?: string;
    temperature?: string;
    leak?: string | null;
    pir?: string | null;
    light_level?: string | null;
    hcho?: string | null;
    pm2_5?: string | null;
    pm10?: string | null;
    o3?: string | null;
    tvoc?: string | null;
    pressure?: string | null;
    magnet_status?: string | null;
    tamper_status?: string | null;
    image?: string | null;
    wind_direction?: string | null;
    wind_speed?: string | null;
    rainfall_total?: string | null;
    rainfall_counter?: string | null;
    power?: string | null;
    total_current?: string | null;
    current?: string | null;
    alarm?: string | null;
    adc_1?: string | null;
    adc_1_avg?: string | null;
    adc_1_max?: string | null;
    adc_1_min?: string | null;
    adc_2?: string | null;
    adc_2_avg?: string | null;
    adc_2_max?: string | null;
    adc_2_min?: string | null;
    adv_1?: string | null;
    adv_2?: string | null;
    counter_1?: string | null;
    counter_2?: string | null;
    counter_3?: string | null;
    counter_4?: string | null;
    gpio_in_1?: string | null;
    gpio_in_2?: string | null;
    gpio_in_3?: string | null;
    gpio_in_4?: string | null;
    gpio_out_1?: string | null;
    gpio_out_2?: string | null;
    pt100_1?: string | null;
    pt100_2?: string | null;
    date?: string;
  }

interface SensorContextType {
  sensors: SensorInterface[];
  setSensors: React.Dispatch<React.SetStateAction<SensorInterface[]>>;
  updateSensor: (sensor: SensorInterface) => void;
  replaceLatestSensor: (sensor: SensorInterface) => void;
  clearSensorsByName: (sensorName: string) => void;
  addSensors: (sensors: SensorInterface[]) => void;
  addSensorName: (sensors: []) => void;
  clearSensors: () => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
  const [sensors, setSensors] = useState<SensorInterface[]>([]);

  // addSensors é usado no userLayout quando entra no app para receber info dos sensores
  // e tbm usado quando for visualizar o gráfico de sensores
  // const addSensors = (newSensors: SensorInterface[]) => {
  //   setSensors((prevSensors) => {
  //     const sensorMap = new Map(
  //       prevSensors.map((sensor) => [sensor.sensor_name + sensor.date, sensor])
  //     );

  //     newSensors.forEach((sensor) => {
  //       sensorMap.set(sensor.sensor_name + sensor.date, sensor);
  //     });
  //     console.log("Contexto Atualizado");
  //     return Array.from(sensorMap.values());
  //   });
  // };
  const addSensors = (newSensors: SensorInterface[]) => {
    setSensors((prevSensors) => {
      const sensorMap = new Map(
        prevSensors.map((sensor) => [sensor.sensor_name + sensor.date, sensor])
      );
      newSensors.forEach((sensor) => {
        sensorMap.set(sensor.sensor_name + sensor.date, sensor); // Atualiza ou adiciona o sensor
      });

      console.log("Contexto Atualizado");
      return Array.from(sensorMap.values());
    });
  };

  // const addSensorName = (newSensors: { name: string; description: string; devEUI: string }[]) => {
  //   setSensors((prevSensors) => {
  //     const sensorMap = new Map(
  //       prevSensors.map((sensor) => [sensor.sensor_name + sensor.date, sensor])
  //     );

  //     newSensors.forEach((device) => {
  //       // const sensorName = `${device.name} - ${device.description} - ${device.devEUI}`;
  //       const newSensor: SensorInterface = {
  //         sensor_name: device.name,
  //         description: device.description,
  //         devEUI: device.devEUI,
  //       };
  //       sensorMap.set(device.name , newSensor);
  //     });

  //     console.log("Contexto Atualizado");
  //     return Array.from(sensorMap.values());
  //   });
  // };

  const addSensorName = (
    newSensors: {
      gateway_id: string;
      devices: {
        name: string;
        description: string;
        devEUI: string;
        parameters: any[];
      }[];
    }[]
  ) => {
    setSensors((prevSensors) => {
      const sensorMap = new Map(
        prevSensors.map((sensor) => [sensor.sensor_name, sensor])
      );
      // colocar tratamento para verificar se existe um sensor e entao permitir o foreach
      newSensors.forEach((sensorGroup) => {
        const { gateway_id, devices } = sensorGroup;
        devices.forEach((device) => {
          const newSensor: SensorInterface = {
            sensor_name: device.name,
            description: device.description,
            deveui: device.devEUI,
            gateway_id: gateway_id,
            parameters: device.parameters,
          };
          sensorMap.set(device.name, newSensor);
        });
      });

      console.log("Contexto Atualizado");
      return Array.from(sensorMap.values());
    });
  };

  // const setStopButtonTriggered = (alarm: string, triggered: boolean) => {
  //   setButtons((prevButtons) =>
  //     prevButtons.map((button) =>
  //       //&& button.button_user === guid  restrição para parar todos os botões
  //       button.button_prt === alarm ? { ...button, triggered } : button
  //     )
  //   );
  // };
  // updateSensors é usado para atualizar os sensores quando recebe eventos "SensorReceived"
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
          const updatedSensors = [sensor, ...prevSensors];
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

  const clearSensors = () => {
    setSensors([]);
  };

  return (
    <SensorContext.Provider
      value={{
        sensors,
        clearSensors,
        setSensors,
        updateSensor,
        replaceLatestSensor,
        clearSensorsByName,
        addSensors,
        addSensorName,
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
