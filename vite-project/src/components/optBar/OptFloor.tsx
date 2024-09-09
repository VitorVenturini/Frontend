import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { host } from "@/App";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface OptFloorProps {
  clickedButton: ButtonInterface;
}

export default function OptFloor({ clickedButton }: OptFloorProps) {
  return (
    <Card className="lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px] w-full relative">
        <TransformWrapper >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <img
              src={host + clickedButton.button_prt}
              alt="img"
              className="h-full w-full relative"
            />
          </TransformComponent>
        </TransformWrapper>
  
    </Card>
  );
}
