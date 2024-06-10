import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface SensorInterface {
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
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
    const [sensors, setSensors] = useState<SensorInterface[]>([]);

    const updateSensor = (sensor: SensorInterface) => {
        setSensors(prevSensors => {
            const sensorIndex = prevSensors.findIndex(s => s.sensor_name === sensor.sensor_name);
            if (sensorIndex !== -1) {
                // Atualizar o sensor existente
                const updatedSensors = [...prevSensors];
                updatedSensors[sensorIndex] = { ...updatedSensors[sensorIndex], ...sensor };
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
        <SensorContext.Provider value={{ sensors, setSensors, updateSensor, clearSensors }}>
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
