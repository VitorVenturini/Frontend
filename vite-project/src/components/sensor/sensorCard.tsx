import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useSensors } from "./SensorContext";

interface SensorCardProps {
  onSensorClick: (deveui: string) => void; // Define a prop para a função de callback
}

export default function SensorCard({ onSensorClick }: SensorCardProps) {
  const { sensors } = useSensors();
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [clickedSensor, setClickedSensor] = useState<string | null>(null);

  const handleClick = (deveui: string) => {
    setClickedSensor(deveui);
    onSensorClick(deveui); // Chama a função de callback passando o deveui
  };

  useEffect(() => {
    sensors.forEach(async (sensor) => {
      try {
        const sensorImage = await import(`../../assets/SensorsPng/${sensor.description}.png`);
        setImages((prevImages) => ({
          ...prevImages,
          [sensor.sensor_name as string]: sensorImage.default,
        }));
      } catch (error) {
        console.error(`Erro ao carregar a imagem para o sensor ${sensor.description}:`, error);
      }
    });
  }, [sensors]);

  return (
    <div className="w-full justify-between">
      {sensors.map((sensor) => (
        <Button
          className="max-w-lg justify-start"
          variant={clickedSensor === sensor.deveui ? "secondary" : "ghost"}
          key={sensor.deveui}
          onClick={() => handleClick(sensor.deveui as any)}
        >
          {images[sensor.sensor_name] && (
            <img
              className="m-2 h-[50px] items-start"
              src={images[sensor.sensor_name]}
              alt={sensor.description}
            />
          )}
          {sensor.sensor_name}
        </Button>
      ))}
    </div>
  );
}
