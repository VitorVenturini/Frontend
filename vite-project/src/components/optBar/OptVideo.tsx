import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OptVideoProps {
  clickedButton: ButtonInterface;
}
export default function OptVideo({ clickedButton }: OptVideoProps) {
  return (
    <Card className="h-full p-1 relative">
      <VideoPlayer url={clickedButton.button_prt} />
    </Card>
  );
}
