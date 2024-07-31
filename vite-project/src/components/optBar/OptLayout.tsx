import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { useSensors } from "../sensor/SensorContext";
import SensorGraph from "@/components/sensor/SensorGraph";
import SensorGrid from "../sensor/SensorGrid";
import { useState, useEffect } from "react";
import BatteryGauge from "react-battery-gauge";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import React, { Component } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useUsers } from "../user/UserContext";
import ChatLayout from "../chat/ChatLayout";
import { useChat } from "../chat/ChatContext";
import { useGoogleApiKey } from "../options/ApiGoogle/GooglApiContext";
import { CarouselImages } from "../cameras/Carousel/CarouselImages";

interface OptLayoutProps {
  clickedButtonId: number | null;
  clickedUser: string | null;
  onKeyChange: (key: string) => void;
}

export default function OptLayout({
  clickedButtonId,
  clickedUser,
}: OptLayoutProps) {
  const { buttons } = useButtons();
  const { sensors } = useSensors();
  const [sensorKey, setSensorKey] = useState<string>("");
  const [clickedKey, setClickedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { users } = useUsers();
  const wss = useWebSocketData();
  const { apiKeyInfo } = useGoogleApiKey();
  const clickedButton = buttons.find((button) => button.id === clickedButtonId);
  const userToChat = users.find((user) => user.guid === clickedUser);
  console.log("UserToChat" + JSON.stringify(userToChat));

  const filteredSensorInfo = sensors.filter(
    (sensor) => sensor.deveui === clickedButton?.button_prt
  );

  useEffect(() => {
    if (clickedButton) {
      if (filteredSensorInfo.length > 0) {
        setTimeout(() => {
          setLoading(false);
        }, 700);
      } else {
        setLoading(true);
      }
    }
  }, [clickedButton, sensors]);

  const handleKeyChange = (key: string) => {
    setSensorKey(key);
  };
  
  const commonClasses = "h-full w-full";
  const renderButtonInfo = () => {
    if (!clickedButton && !userToChat) return null;

    if (clickedButton) {
      switch (clickedButton.button_type) {
        case "sensor":
          if (loading) {
            return <div><Skeleton className="p-2 rounded-full" /> </div>;
          } 
          else {
            return (
              <div className="w-full">
                {!sensorKey && (
                  <div>Selecione a informação que você visualizar</div>
                )}
                <SensorGrid
                  sensorInfo={filteredSensorInfo}
                  onKeyChange={handleKeyChange}
                  clickedKey={clickedKey}
                  setClickedKey={setClickedKey}
                />
                {sensorKey && (
                  <SensorGraph
                    sensorInfo={filteredSensorInfo}
                    sensorKey={sensorKey}
                  />
                )}

                {/* <SensorGraph sensorInfo={filteredSensorInfo} /> */}
                {/* {filteredSensorInfo.map((sensor) => (
                <div>
                  <div>Nome do Sensor: {sensor?.sensor_name}</div>
                  <div>Bateria: {sensor?.battery}</div>
                  <div>Temperatura: {sensor?.temperature}</div>
                  <div>CO²: {sensor?.co2}</div>
                </div>
              ))} */}
              </div>
            );
          }
        case "camera":
          if (loading) {
            return <div>Carregando dados da Câmera...</div>;
          } else {
            return (
              <div>
                <CarouselImages cameraInfo={filteredSensorInfo} />
              </div>
            );
          }

        case "floor":
          const extension = clickedButton?.button_prt
            .split(".")
            .pop()
            ?.toLowerCase();
          if (extension === "pdf") {
            return (
              <iframe
                src={clickedButton?.button_prt}
                className="h-full w-full"
                style={{ height: "calc(100vh - 200px)" }}
              />
            );
          } else {
            return (
              <div>
              <TransformWrapper >
                <TransformComponent>
                  <img src={clickedButton.button_prt} alt="img"/>
                </TransformComponent>
              </TransformWrapper>
              </div>
            );
          }
        case "maps":
          const filteredGoogleAPI = apiKeyInfo.filter((key) => {
            return key.entry === "googleApiKey";
          })[0];
          const googleMapsUrl = `
          https://www.google.com/maps/embed/v1/view?key=${filteredGoogleAPI.value}&center=${clickedButton.button_prt}&zoom=14&maptype=roadmap`;
          return (
            <div className="h-fit w-full">
              <iframe
                width="100%"
                height="100%"
                className="h-full "
                frameBorder="0"
                src={googleMapsUrl}
                allowFullScreen
              ></iframe>
            </div>
          );
        case "radio":
        case "video":
          return (
            <div className="w-full">
              <VideoPlayer url={clickedButton.button_prt} />
            </div>
          );
        default:
          return null;
      }
    } else if (userToChat) {
      return (
        <div>
          <ChatLayout userToChat={userToChat} />
        </div>
      );
    }
  };

  return renderButtonInfo();
}
