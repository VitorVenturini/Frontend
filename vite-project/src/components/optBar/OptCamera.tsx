import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { SensorInterface } from "../sensor/SensorContext";
import { CarouselImages } from "../cameras/Carousel/CarouselImages";
interface OptCameraProps {
    filteredSensorInfo: SensorInterface[];
}

export default function OptCamera({ filteredSensorInfo }: OptCameraProps) {
  return (
    <Card className="h-full">
      <CarouselImages cameraInfo={filteredSensorInfo} />
    </Card>
  );
}
