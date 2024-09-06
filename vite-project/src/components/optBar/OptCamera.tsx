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
import { useState, useEffect } from "react";
import corruptImage from "../../assets/corruptImage.png";
import { format } from "date-fns";
import LogoCore from "@/assets/Vector.svg";
interface OptCameraProps {
  filteredSensorInfo: SensorInterface[];
}

export default function OptCamera({ filteredSensorInfo }: OptCameraProps) {
  const [active, setActive] = useState(filteredSensorInfo[0]?.image || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (filteredSensorInfo.length > 0) {
      setActive(filteredSensorInfo[0]?.image || "");
    }
    console.log("Passou aqui");
  }, [filteredSensorInfo[0]?.image]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  function isImageValid(base64String: string): string {
    if (!base64String) {
      return corruptImage;
    } else return base64String;
  }

  return (
    <Card className="h-full w-full relative items-center lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px] align-middle">
      {isLoading ? (
        <div className="flex w-full h-full justify-center align-middle items-center">
          <img src={LogoCore} className="h-12 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full w-full relative items-center align-middle justify-center gap-1  ">
          <div className="flex h-full relative">
            <img
              className=" h-full w-full relative object-cover"
              src={active}
              alt=""
            />
          </div>
          <div className="grid grid-cols-2 grid-rows-5 gap-1 relative">
            {filteredSensorInfo.map((sensor, index) => (
              <div key={index}>
                <img
                  onClick={() => setActive(isImageValid(sensor?.image || ""))}
                  src={sensor?.image || ""}
                  className={`h-7 xl2:h-12 max-w-full cursor-pointer rounded-lg object-cover object-center relative ${
                    sensor?.image === active
                      ? "outline outline-3 border-lg border-red-900 outline-red-900"
                      : ""
                  } `}
                  alt={`gallery-image-${index}`}
                />
                <div className="w-full flex justify-center text-[7px] xl2:text-[9px]">
                  {sensor?.date
                    ? format(new Date(sensor?.date), "dd/MM \n HH:mm:ss")
                    : "Data não disponível"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
