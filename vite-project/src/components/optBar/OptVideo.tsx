import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { Card } from "@/components/ui/card";


interface OptVideoProps {
  clickedButton: ButtonInterface;
}
export default function OptVideo({ clickedButton }: OptVideoProps) {
  return (
    <Card className="lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px] relative">
      <VideoPlayer url={clickedButton.button_prt} open={true}/>
    </Card>
  );
}
