import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import LicenseCard from "@/components/options/CardLicense";
import CardDataBase from "@/components/options/CardDataBase";
import Gateways from "@/components/options/Gateways";
import ContaCard from "@/components/options/ContaCard";
import SMTPconfig from "@/components/options/SMTPconfig";
import RadioCard from "@/components/options/RadioCard";
import PbxConfigCard from "@/components/options/Pbx/PbxConfigCard";
import IotCameraCard from "@/components/options/IotCameraCard";
import Notify from "@/components/options/Notifications/Notifications";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import ApparenceCard from "@/components/options/ApparenceCard";
import APIsOption from "@/components/options/Apis/ApisOptions";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

export default function MenuOptions() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const wss = useWebSocketData();
  const { language } = useLanguage();
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
        return <CardDataBase />;
      case "Gateways":
        return <Gateways />;
      case "Radio":
        return <RadioCard />;
      case "TelephonePBX":
        return <PbxConfigCard />;
      case "APIs":
        return <APIsOption />;
      case "IotCamera":
        return <IotCameraCard />;
      case "Notifications":
        return <Notify />;
        case "Email":
          return <SMTPconfig />;
      case "Apparence":
        return <ApparenceCard />;    
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
        >{texts[language].configLicenseLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Apparence")}  
        >
         {texts[language].configThemeLabel} 
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("DataBase")}
        >{texts[language].configBackupLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Radio")}
        >{texts[language].configRadioLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("TelephonePBX")}
        >{texts[language].configPbxLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("APIs")}
        >
          {texts[language].configApisLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("IotCamera")}
        >
          {texts[language].configCamerasLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Gateways")}
        >{texts[language].configGatewaysLabel}
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Notifications")}
        >{texts[language].configNotificationsLabel}
          
        </Button>
        <Button
          className="focus:bg-accent"
          variant={"ghost"}
          onClick={() => handleClick("Email")}
        >{texts[language].configSmtpLabel}

        </Button>
      </div>
      <div className="flex justify-center items-start w-full">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
