import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SensorInterface } from "../sensor/SensorContext";
import { format } from "date-fns";

interface CarouselImagesProps {
  cameraInfo: SensorInterface[];
}

export function CarouselImages({ cameraInfo }: CarouselImagesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        className="w-[300px] flex justify-center"
      >
        <CarouselContent>
          {cameraInfo?.map((sensor, index) => (
            <CarouselItem key={index}>
              <img src={sensor?.image as string} alt={`Camera ${index + 1}`} />
              <div className="w-full flex justify-center">
                {sensor?.date
                  ? format(new Date(sensor?.date), "dd/MM/yyyy HH:mm:ss")
                  : "Data não disponível"}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Imagem {current} de 10
      </div>
    </div>
  );
}
