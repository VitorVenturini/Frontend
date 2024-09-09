// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import { useSensors } from "./SensorContext";
// import ResponsivePng from "./ResponsivePng";

interface ComboCardProps {
  onSensorClick: (deveui: string) => void; // Define a prop para a função de callback
  filter: string;
}

export default function comboCard({ }: ComboCardProps) {
//   const { sensors } = useSensors();
//   const [clickedSensor, setClickedSensor] = useState<string | null>(null);
  
//   const handleClick = (deveui: string) => {
//     setClickedSensor(deveui);
//     onSensorClick(deveui); // Chama a função de callback passando o deveui
//   };

//   // Filtra os sensores baseado na string de filtro
//   const filteredSensors = sensors.filter(sensor =>
//     sensor.sensor_name.toLowerCase().includes(filter.toLowerCase())
//   );

  return (
    <div className="w-full justify-between">
      teste
    </div>
  );
}
