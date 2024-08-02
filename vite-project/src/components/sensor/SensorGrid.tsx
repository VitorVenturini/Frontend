import SensorDisplay from "@/components/sensor/SensorDisplay";
import { SensorInterface } from "./SensorContext";
import { useState,useEffect } from "react";
import BatteryGauge from "react-battery-gauge";

interface SensorGridProps {
  sensorInfo: SensorInterface[];
  onKeyChange: (key: string) => void;
  setClickedKey: (key: string | null) => void;
  clickedKey: string | null;
}

export default function SensorGrid({
  sensorInfo,
  onKeyChange,
  setClickedKey,
  clickedKey,
}: SensorGridProps) {
  const firstSensor = sensorInfo[0]; // Pega o primeiro objeto do array
  console.log("FirstSensorInfo" + JSON.stringify(firstSensor));
  const [isClicked, setIsClicked] = useState(false);
  console.log("Info Recebida via Prop" + JSON.stringify(sensorInfo))

  return (
    <div className="max-h-[2px]">
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3 p-2">
        {firstSensor &&
          Object.entries(firstSensor).map(
            ([key, value]) =>
              key !== "id" &&
              key !== "sensor_name" &&
              key !== "battery" &&
              key !== "date" &&
              key !== "deveui" && (
                <SensorDisplay
                  key={key}
                  SensorKey={key}
                  sensorValue={value}
                  sensorInfo={sensorInfo}
                  onKeyChange={onKeyChange}
                  isClicked={clickedKey === key}
                  onClick={() => {
                    //setIsClicked(!isClicked);
                    setClickedKey(clickedKey === key ? null : key);
                    //setClickedButtonId(clickedButtonId === button.id ? null : button.id);
                  }}
                />
              )
          )}
      </div>
      <BatteryGauge className="p-1 w-full"
        value={Number(firstSensor?.battery) || 0}
        size={200}
        aspectRatio={0.3}
        orientation="horizontal"
        
        customization={{
            batteryBody: {
                strokeWidth: 1
              },
              batteryCap: {
                strokeWidth: 2
              },
        }}
      />
    </div>
  );
}
