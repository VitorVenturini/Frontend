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

export default function Devices({ gatewayId }) {
  console.log("Devices", gatewayId);
  const [filterDevice, setFilterDevice] = useState("");
  const [selectedDeveui, setSelectedDeveui] = useState(null);
  const handlefilterDevice = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterDevice(event.target.value);
  };

  const wss = useWebSocketData();
  const { sensors } = useSensors();
  const selectedSensor = sensors.find((sensor) => sensor.deveui === selectedDeveui);

  const handleSensorClick = (deveui:string) => {
    setSelectedDeveui(deveui);
  };

  const renderSensorCard = () => {
    if (!selectedSensor)
      return (
        <Card className="w-full p-4">
          <CardDescription>
            Selecione um dispositivo para ver os detalhes
          </CardDescription>
        </Card>
      );
    return (
      <div className="w-full p-4 bg-muted flex flex-col items-center justify-between h-full">
        <ResponsivePng sensorModel={selectedSensor.description} size="image"/>
        <div className="flex flex-col p-1 gap-2 w-full justify-start">
          <div>
            {selectedSensor.description}
          </div>
          <div>
            {selectedSensor.deveui}
          </div>
          <div>
            {selectedSensor.sensor_name}
          </div>

        </div>
      </div>
    );
  };
  return (
    <div>
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
