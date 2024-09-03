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

//   return (
//     <div className="w-full justify-between">
//       {filteredSensors.map((sensor) => (
//         <Button
//           className="max-w-lg justify-start w-full"
//           variant={clickedSensor === sensor.deveui ? "secondary" : "ghost"}
//           key={sensor.deveui}
//           onClick={() => handleClick(sensor.deveui as any)}
//         >
//           <div className="grid grid-cols-5 grid-rows-1 items-center align-middle">
//             {sensor.sensor_name && (
//               <ResponsivePng sensorModel={sensor.description} />
//             )}
//             <p>{sensor.sensor_name}</p>
//           </div>
//         </Button>
//       ))}
//     </div>
//   );
}
