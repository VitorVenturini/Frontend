import { Contact } from 'lucide-react';
import AM103 from '../../assets/SensorsPng/AM103.png';
import EM300_TH from '../../assets/SensorsPng/EM300-TH.png';
import WS101_SOS from '../../assets/SensorsPng/WS101_SOS.png';
import WS301 from '../../assets/SensorsPng/WS301.png';



interface ButtonProps {
    sensorName: string;
}

export default function ResponsivePng({ sensorName }: ButtonProps) {
    let imageSrc;
    let altText;

    switch (sensorName) {
        case 'Sensor Técnica':
            imageSrc = AM103;
            altText = "AM103 Sensor";
            break;
        case 'Sensor Leak':
            imageSrc = EM300_TH;
            altText = "EM300_TH Sensor";
            break;
        case 'Magnetic Contact':
            imageSrc = WS301;
            altText = "WS301 Sensor";
            break;
        case 'Smart Button':
            imageSrc = WS101_SOS;
            altText = "WS101_SOS Sensor";
            break;
        default:
            imageSrc = ''; // ou uma imagem padrão
            altText = "Default Sensor";
    }

    return (
        <div className='w-7'>
          <img src={imageSrc} alt={altText} />
        </div>
    );
};
    