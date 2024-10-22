import ResponsivePng from "../sensor/ResponsivePng";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useSensors } from "../sensor/SensorContext";
import SensorCell from "../sensor/sensorCell";
import { ScrollArea } from "../ui/scroll-area";

export default function Devices({
  existingButton,
}) {
    const [filterDevice, setFilterDevice] = useState("");
  const [selectedSensor, setSelectedSensor] = useState(null);


 const handlefilterDevice = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterDevice(event.target.value);
      };
    
const wss = useWebSocketData();

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };



  const renderSensorCard = () => {
    if (!selectedSensor) return (
        <Card className="w-full p-4">
            <CardDescription>Selecione um dispositivo para ver os detalhes</CardDescription>
        </Card>
        );
    ;

    return (
      <Card className="w-full p-4 bg-muted">
        <ResponsivePng sensorModel={selectedSensor.description} />

        <h2 className="text-xl font-bold">{selectedSensor.name}</h2>
        <p>ID: {selectedSensor.sensor_name}</p>
        <p>Status: {selectedSensor.status}</p>
      </Card>
    );
  };
  return (
    <div >
      <CardContent className=" w-full flex gap-4 py-4">
        <div className="flex flex-col w-[50%] items-center gap-4">
          <Input
            className="w-full"
            id="buttonName"
            placeholder="Filtrar..."
            onChange={handlefilterDevice}
          />
          <div className="gap-4">
            <ScrollArea className="h-[350px] w-full border border-input">
              <SensorCell
                onSensorClick={handleSensorClick}
                filter={filterDevice}
              />
            </ScrollArea>
          </div>
        </div>
        <div className="flex flex-col w-[50%] items-center gap-4">
          {renderSensorCard()}
        </div>
      </CardContent>
    </div>
  );
}
