import { Button } from "@/components/ui/button";
import { useState } from "react";
import LicenseCard from "@/components/options/CardLicense";
import CardClearDB from "@/components/options/CardClearDB";
import GatewayCard from "@/components/options/GatewayCard";
import ContaCard from "@/components/options/ContaCard";
import RadioCard from "@/components/options/RadioCard";
import TelephonePBXCard from "@/components/options/TelephonePBXCard";
import APIGoogleCard from "@/components/options/ApiGoogle/APIGoogleCard";
import IotCameraCard from "@/components/options/IotCameraCard";

export default function MenuOptions() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleClick = (buttonMenu: string) => {
    setActiveButton(buttonMenu);
  };

  const renderActiveComponent = () => {
    switch (activeButton) {
      case "License":
        return <LicenseCard />;
      case "DataBase":
        return <CardClearDB />;
      case "Gateway":
        return <GatewayCard />;
      case "Conta":
        return <ContaCard />;
      case "Radio":
        return <RadioCard />;
      case "TelephonePBX":
        return <TelephonePBXCard />;
      case "APIGoogle":
        return <APIGoogleCard />;
      case "IotCamera":
        return <IotCameraCard />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col justify-end gap-4 m-4">
        <Button
          className="focus:bg-accent"
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
          onClick={() => handleClick("Gateway")}
        >
          Gateway
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Conta")}
        >
          Conta
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
          Telephone PBX
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
      </div>
      <div className="flex align-middle justify-center items-center w-full">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
