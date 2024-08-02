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
    <Card className="h-full">
        <TransformWrapper initialScale={0.2} minScale={0.1} maxScale={2}>
          <TransformComponent>
            <img
              src={clickedButton.button_prt}
              alt="img"
              className="object-contain w-full h-full"
            />
          </TransformComponent>
        </TransformWrapper>
  
    </Card>
  );
}
