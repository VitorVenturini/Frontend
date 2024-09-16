import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import LicenseCard from "@/components/options/CardLicense";
import CardClearDB from "@/components/options/CardClearDB";
import Gateways from "@/components/options/Gateways";
import ContaCard from "@/components/options/ContaCard";
import RadioCard from "@/components/options/RadioCard";
import PbxConfigCard from "@/components/options/Pbx/PbxConfigCard";
import APIGoogleCard from "@/components/options/ApiGoogle/APIGoogleCard";
import IotCameraCard from "@/components/options/IotCameraCard";
import Notify from "@/components/options/Notifications";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

export default function MenuOptions() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const wss = useWebSocketData();
  const handleClick = (buttonMenu: string) => {
    if (buttonMenu === "TelephonePBX") {
      wss?.sendMessage({
        api: "admin",
        mt: "PbxStatus",
      });
    }
    setActiveButton(buttonMenu);
  };
  useEffect(() => {
    setActiveButton("License");
  }, []); // setar License como default sempre

  const renderActiveComponent = () => {
    switch (activeButton) {
      case "License":
        return <LicenseCard />;
      case "DataBase":
        return <CardClearDB />;
      case "Gateways":
        return <Gateways />;
      case "Radio":
        return <RadioCard />;
      case "TelephonePBX":
        return <PbxConfigCard />;
      case "APIGoogle":
        return <APIGoogleCard />;
      case "IotCamera":
        return <IotCameraCard />;
      case "Notifications":
        return <Notify />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full h-full justify-between">
      <div className="flex flex-col justify-start p-2 gap-4 h-[calc(100vh-92px)] bg-card">
        <Button
          className={ `${activeButton === "License" ? "bg-accent" : ""} focus:bg-accent`} 
          variant={"ghost"}
          onClick={() => handleClick("License")}
        >
          License
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("DataBase")}
        >
          Data Base
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Radio")}
        >
          Radio
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("TelephonePBX")}
        >
          PBX
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("APIGoogle")}
        >
          API Google
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("IotCamera")}
        >
          Iot Câmeras
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Gateways")}
        >
          Iot Gateways
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Notifications")}
        >
          Notificações
        </Button>
      </div>
      <div className="flex justify-center items-start w-full">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
