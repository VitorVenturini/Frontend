import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface OptFloorProps {
  clickedButton: ButtonInterface;
}

export default function OptFloor({ clickedButton }: OptFloorProps) {
  return (
    <Card className="h-full w-full relative">
        <TransformWrapper >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <img
              src={clickedButton.button_prt}
              alt="img"
              className="h-full w-full relative"
            />
          </TransformComponent>
        </TransformWrapper>
  
    </Card>
  );
}
