import { on } from "events";
import { SensorInterface } from "./SensorContext";
import { CircleArrowUp } from "lucide-react";
import { useState } from "react";

interface SensorDisplayProps {
  SensorKey: string;
  sensorValue: string | number | undefined;
  sensorInfo: SensorInterface[];
  onKeyChange: (key: string) => void;
  isClicked: boolean
  onClick: () => void; // Adicione esta linha
  
}

export default function SensorDisplay({
  SensorKey,
  sensorValue,
  sensorInfo,
  onKeyChange,
  isClicked,
  onClick
}: SensorDisplayProps) {
  const [selectedKey, setSelectedKey] = useState("");

  const handleSensorClick = (key: string) => {
    onClick();
    console.log("Clicando");
    setSelectedKey(key);
    console.log("key:" + key);
    onKeyChange(key);
    
    
  };
  return (
    <div
      className={`bg-muted px-2 py-1 rounded-lg cursor-pointer ${isClicked ? "bg-zinc-950" : ""}`}
      onClick={() => handleSensorClick(SensorKey)}
    >
      <div className="text-sm">{SensorKey}</div>
      <div className="flex justify-between">
        <p className="text-md font-bold">{sensorValue}</p>
        <CircleArrowUp size={20} color="red"/>
      </div>
    </div>
  );
}
