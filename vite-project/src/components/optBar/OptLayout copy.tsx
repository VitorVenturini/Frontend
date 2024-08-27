import React, { useState, useEffect } from "react";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { useSensors } from "../sensor/SensorContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useUsers } from "../users/usersCore/UserContext";
import { SensorInterface } from "../sensor/SensorContext";
import ChatLayout from "../chat/ChatLayout";
import OptFloor from "./OptFloor";
import OptMap from "./OptMap";
import OptRadio from "./OptRadio";
import OptVideo from "./OptVideo";
import OptSensor from "./OptSensor";
import OptCamera from "./OptCamera";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OptChat from "./OptChat";
import OptHistory from "./OptHistory";

interface OptLayoutCopyProps {
  clickedButtonId: number | null;
  clickedUser: string | null;
}

export default function OptLayoutCopy(props: OptLayoutCopyProps) {
  const { clickedButtonId, clickedUser } = props;
  const { buttons } = useButtons();
  const { graphSensors,cameraImages } = useSensors();
  const [sensorKey, setSensorKey] = useState<string>("");
  const [clickedKey, setClickedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { users } = useUsers();

  const clickedButton = buttons.find((button) => button.id === clickedButtonId);
  const userToChat = users.find((user) => user.guid === clickedUser);

  const filteredSensorInfo = graphSensors.filter(
    (sensor) => sensor.deveui === clickedButton?.button_prt
  );

  const filteredCamInfo = cameraImages.filter(
    (sensor) => sensor.deveui === clickedButton?.button_prt
  );

  useEffect(() => {
    if (clickedButton) {
      if (filteredSensorInfo.length > 0) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [clickedButton, graphSensors]);

  const handleKeyChange = (key: string) => {
    setSensorKey(key);
  };

  const renderContent = () => {
    if (clickedButton) {
      switch (clickedButton.button_type) {
        case "floor":
          return <OptFloor clickedButton={clickedButton} />;
        case "maps":
          return <OptMap clickedButton={clickedButton} />;
        case "radio":
          return <OptRadio clickedButton={clickedButton} />;
        case "video":
          return <OptVideo clickedButton={clickedButton} />;
        case "sensor":
          return (
            <OptSensor
              sensorKey={sensorKey}
              handleKeyChange={handleKeyChange}
              filteredSensorInfo={filteredSensorInfo}
              clickedKey={clickedKey}
              setClickedKey={setClickedKey}
            />
          );
        case "camera":
          return <OptCamera filteredSensorInfo={filteredCamInfo} />;
        default:
          return <div>Selecione uma opção</div>;
      }
    } else if (userToChat) {
      return (
        <div>
          {/*<OptChat userToChat={userToChat} />
          {/* <ChatLayout userToChat={userToChat} /> */}
        </div>
      );
    } else {
      return(
        <OptHistory/>
      )
    }

    return <div>Por favor, selecione uma opção ou usuário</div>;
  };

  return (
    <Card className="rounded-none bg-transparent w-full h-full relative sm:h-[292px] xl3:h-[500px]">
      {renderContent()}
    </Card>
  );
}
