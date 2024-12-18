import { Contact } from "lucide-react";
import AM103 from "../../assets/SensorsPng/AM103.png";
import EM300_SLD from "../../assets/SensorsPng/EM300-SLD.png";
import WS101_SOS from "../../assets/SensorsPng/WS101.png";
import WS301 from "../../assets/SensorsPng/WS301.png";
import UC300 from "@/assets/SensorsPng/UC300.png";
import WTS506 from "@/assets/SensorsPng/WTS506.png";
import WS202 from "@/assets/SensorsPng/WS202.png";
import AM307 from "@/assets/SensorsPng/AM307.png";
import WS156 from "@/assets/SensorsPng/WS156.png";
import VS121 from "@/assets/SensorsPng/VS121.png";
import placeHolder from "@/assets/SensorsPng/devicePlaceholder.png"
interface ButtonProps {
  sensorModel: string | undefined;
  size: 'icon' | 'image';
}

export default function ResponsivePng({ sensorModel,size }: ButtonProps) {
  let imageSrc;
  let altText;
  //case sensorModel?.startsWith("AM103"):

  switch (sensorModel) {
    case "AM103":
      imageSrc = AM103;
      altText = "AM103 Sensor";
      break;
    case "AM307":
      imageSrc = AM307;
      altText = "AM307 Sensor";
      break;
    case "EM300-SLD":
      imageSrc = EM300_SLD;
      altText = "EM300_SLD Sensor";
      break;
    case "WS301":
      imageSrc = WS301;
      altText = "WS301 Sensor";
      break;
    case "WS101":
      imageSrc = WS101_SOS;
      altText = "WS101_SOS Sensor";
      break;
    case "WS156":
      imageSrc = WS156;
      altText = "WS156 Sensor";
      break;
    case "WS202":
      imageSrc = WS202;
      altText = "WS202 Sensor";
      break;
    case "UC300":
      imageSrc = UC300;
      altText = "UC300 Sensor";
      break;
    case "WTS506":
      imageSrc = WTS506;
      altText = "WTS506 Sensor";
      break;
    case "VS121":
      imageSrc = VS121;
      altText = "VS121 Sensor";
      break;
    default:
      imageSrc = placeHolder; // ou uma imagem padrão
      altText = "Default Sensor";
  }
  const width = size === 'icon' ? 20 : 100; // Define o tamanho com base na prop size


  return (
    <div>
      <img src={imageSrc} alt={altText} width={width}  />
    </div>
  );
}
