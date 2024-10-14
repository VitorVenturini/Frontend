import React, { useEffect, useState } from "react";
import beep from "@/assets/sounds/bleep.wav";
import minor from "@/assets/sounds/minor.wav";
import mobile from "@/assets/sounds/mobile.wav";
import suspiciou from "@/assets/sounds/suspiciou.wav";
import { AudioPlayer } from "react-audio-player-component";
import { Checkbox } from "../../ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../../ui/button";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useToast } from "@/components/ui/use-toast";
import { useAppConfig } from "../ConfigContext";

const CardNotificationAlarm = () => {
  const { notification, updateNotification } = useAppConfig();

  useEffect(() => {
    const sensorNotification = notification.find(
      (item) => item.entry === "alarmNotification"
    );

    if (sensorNotification) {
      setSelectedAudio(sensorNotification.value);
    }
  }, [notification]);

  const [selectedAudio, setSelectedAudio] = useState("");
  const wss = useWebSocketData();
  const handleCheckboxChange = (audioId: string) => {
    setSelectedAudio(audioId);
  };
  const { toast } = useToast();

  const handleClick = () => {
    if (selectedAudio) {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        entry: "alarmNotification",
        vl: selectedAudio,
      });
      toast({
        variant: "default",
        description:
          "Notificação Salva com Sucesso",
      });

      updateNotification("alarmNotification", selectedAudio);
    } else {
      toast({
        variant: "destructive",
        description:
          "Você precisa selecionar algum som de notificação para Alarmes",
      });
    }
  };

  return (
    <Card className="min-w-[450px] w-fit h-fit p-2">
      <CardHeader className="flex-row items-center align-middle w-full justify-between gap-4">
        <CardTitle>
          <p>Alarmes</p>
          <CardDescription>
            Selecione um audio padrão para Alarmes
          </CardDescription>
        </CardTitle>
        <Button onClick={handleClick}>Salvar</Button>
      </CardHeader>
      <div className="bg-card justify-center items-center gap-2 h-fit">
        <div className="items-center flex space-x-2 p-2">
          <Checkbox
            id="beep"
            checked={selectedAudio === "beep"}
            onCheckedChange={() => handleCheckboxChange("beep")}
          />
          <AudioPlayer
            src={beep}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>beep</p>
        </div>
        <div className="items-center flex space-x-2 p-2">
          <Checkbox
            id="minor"
            checked={selectedAudio === "minor"}
            onCheckedChange={() => handleCheckboxChange("minor")}
          />
          <AudioPlayer
            src={minor}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>minor</p>
        </div>
        <div className="items-center flex space-x-2 p-2">
          <Checkbox
            id="mobile"
            checked={selectedAudio === "mobile"}
            onCheckedChange={() => handleCheckboxChange("mobile")}
          />
          <AudioPlayer
            src={mobile}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>mobile</p>
        </div>
        <div className="items-center flex space-x-2 p-2">
          <Checkbox
            id="suspiciou"
            checked={selectedAudio === "suspiciou"}
            onCheckedChange={() => handleCheckboxChange("suspiciou")}
          />
          <AudioPlayer
            src={suspiciou}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>suspiciou</p>
        </div>
      </div>
    </Card>
  );
};

export default CardNotificationAlarm;
