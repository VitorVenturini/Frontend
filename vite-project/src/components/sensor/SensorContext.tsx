import React, { createContext, useState, useContext, ReactNode } from "react";

export interface SensorInterface {
  id?: string;
  sensor_name: string;
  deveui?: string;
  battery?: string;
  co2?: string;
  description?: string;
  gateway_id: string;
  parameters: any[];
  humidity?: string;
  temperature?: string;
  leak?: string | null;
  daylight?: string | null;
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
  people_count_all?: string | null;
  people_count_max?: string | null;
  people_in?: string | null;
  people_out?: string | null;
  people_total_in?: string | null;
  people_total_out?: string | null;
  region_1?: string | null;
  region_2?: string | null;
  region_3?: string | null;
  region_4?: string | null;
  region_5?: string | null;
  region_6?: string | null;
  region_7?: string | null;
  region_8?: string | null;
  region_9?: string | null;
  region_10?: string | null;
  region_11?: string | null;
  region_12?: string | null;
  region_13?: string | null;
  region_14?: string | null;
  region_15?: string | null;
  region_16?: string | null;
  date?: string;
}

interface SensorContextType {
  sensors: SensorInterface[];
  buttonSensors: SensorInterface[];
  graphSensors: SensorInterface[];
  cameraImages: SensorInterface[];
  setSensors: React.Dispatch<React.SetStateAction<SensorInterface[]>>;
  addSensors: (sensors: SensorInterface[]) => void;
  addImages: (newImgs: SensorInterface[]) => void;
  addSensorsButton: (sensors: SensorInterface[]) => void;
  updateSensorButton: (sensor: SensorInterface) => void;
  updateGraphSensor: (sensor: SensorInterface) => void;
  updateGalleryImages: (camera: SensorInterface) => void;
  replaceLatestSensor: (sensor: SensorInterface) => void;
  clearSensorsByEUI: (eui: string) => void;
  clearCamByEUI: (eui: string) => void;
  addSensorName: (sensors: []) => void;
  clearSensors: () => void;
  clearGraphSensors: () => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
  const [sensors, setSensors] = useState<SensorInterface[]>([]);
  const [buttonSensors, setButtonSensors] = useState<SensorInterface[]>([]);
  const [graphSensors, setGraphSensors] = useState<SensorInterface[]>([]);
  const [cameraImages, setCameraImages] = useState<SensorInterface[]>([]);

  const addSensors = (newSensors: SensorInterface[]) => {
    setGraphSensors((prevGraphSensors) => [...prevGraphSensors, ...newSensors]);
  };

  // const updateGraphSensor = (sensor: SensorInterface) => {
  //   setGraphSensors((prevGraphSensors) => {
  //     const sensorGraphData = prevGraphSensors.filter(
  //       (s) => s.sensor_name === sensor.sensor_name
  //     );

  //     const lastGraphSensor = sensorGraphData[0]; // O mais recente

  //     if (lastGraphSensor && lastGraphSensor.date === sensor.date) {
  //       return prevGraphSensors; // Sem mudança, já que é a mesma data
  //     } else {
  //       return [sensor, ...prevGraphSensors];
  //     }
  //   });
  // };
  const updateGraphSensor = (sensor: SensorInterface) => {
    setGraphSensors((prevGraphSensors) => {
      // Filtra os dados existentes do sensor específico em graphSensors
      const sensorSpecificData = prevGraphSensors.filter(
        (s) => s.sensor_name === sensor.sensor_name
      );

      // Verifica se o novo dado é idêntico ao mais recente já existente
      const lastGraphSensor = sensorSpecificData[0]; // O mais recente

      const isDuplicate =
        lastGraphSensor &&
        Object.keys(sensor).every(
          (key) =>
            sensor[key as keyof SensorInterface] ===
            lastGraphSensor[key as keyof SensorInterface]
        );

      // Se o dado for duplicado, não faz nada
      if (isDuplicate) {
        return prevGraphSensors;
      }

      // Adiciona o novo dado do sensor no início da lista
      sensorSpecificData.unshift(sensor);

      // Garante que o sensor específico tenha no máximo 10 registros
      if (sensorSpecificData.length > 10) {
        sensorSpecificData.pop(); // Remove o último elemento do sensor específico
      }

      // Substitui os dados do sensor específico no graphSensors com os atualizados
      return [
        ...prevGraphSensors.filter((s) => s.sensor_name !== sensor.sensor_name),
        ...sensorSpecificData,
      ];
    });
  };

  const addImages = (newImgs: SensorInterface[]) => {
    setCameraImages((prevCamImages) => [...prevCamImages, ...newImgs]);
  };

  const updateGalleryImages = (image: SensorInterface) => {
    setCameraImages((prevCameraImages) => {
      // Filtra as imagens existentes do mesmo sensor
      const cameraSpecificImages = prevCameraImages.filter(
        (img) => img.deveui === image.deveui
      );

      // Verifica se a nova imagem é idêntica à mais recente já existente
      const lastCameraImage = cameraSpecificImages[0]; // A mais recente

      const isDuplicate =
        lastCameraImage &&
        Object.keys(image).every(
          (key) =>
            image[key as keyof SensorInterface] ===
            lastCameraImage[key as keyof SensorInterface]
        );

      // Se a imagem for duplicada, não faz nada
      if (isDuplicate) {
        return prevCameraImages;
      }

      // Adiciona a nova imagem no início da lista
      const updatedImages = [image, ...cameraSpecificImages];

      // Garante que a lista de imagens para o mesmo sensor não exceda 10 itens
      if (updatedImages.length > 10) {
        updatedImages.pop(); // Remove a imagem mais antiga, se necessário
      }

      // Substitui as imagens do mesmo sensor na lista geral com as atualizadas
      return [
        ...prevCameraImages.filter((img) => img.deveui !== image.deveui),
        ...updatedImages,
      ];
    });
  };

  const addSensorsButton = (newSensors: SensorInterface[]) => {
    setButtonSensors(newSensors); // Alimenta diretamente o buttonSensors com 1 registro de cada sensors
  };

  const updateSensorButton = (sensor: SensorInterface) => {
    setButtonSensors((prevButtonSensors) => {
      const updatedButtonSensors = prevButtonSensors.filter(
        (s) => s.sensor_name !== sensor.sensor_name
      ); // pega a lista atualizada com todos os sensores exclue o valor antigo de cada sensors e atualiza um valor novo

      updatedButtonSensors.unshift(sensor); // Adiciona o sensor ao início
      return updatedButtonSensors;
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

  const clearSensorsByEUI = (eui: string) => {
    setGraphSensors((prevSensors) =>
      prevSensors.filter((sensor) => sensor.deveui !== eui)
    );
  };

  const clearCamByEUI = (eui: string) => {
    setCameraImages((prevCams) =>
      prevCams.filter((cams) => cams.deveui !== eui)
    );
  };

  const clearSensors = () => {
    setSensors([]);
    setButtonSensors([]);
    setGraphSensors([]);
    setCameraImages([]);
  };

  const clearGraphSensors = () => {
    setGraphSensors([]);
  };

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

  return (
    <SensorContext.Provider
      value={{
        sensors,
        cameraImages,
        buttonSensors,
        graphSensors,
        setSensors,
        addSensors,
        addImages,
        addSensorsButton,
        updateSensorButton,
        updateGraphSensor,
        updateGalleryImages,
        replaceLatestSensor,
        clearSensorsByEUI,
        clearCamByEUI,
        addSensorName,
        clearSensors,
        clearGraphSensors,
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
