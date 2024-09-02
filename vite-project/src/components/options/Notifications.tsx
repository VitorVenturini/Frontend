import beep from "../../../src/assets/sounds/bleep.wav";
import minor from "../../../src/assets/sounds/minor.wav";
import mobile from "../../../src/assets/sounds/mobile.wav";
import suspiciou from "../../../src/assets/sounds/suspiciou.wav";
import ReactAudioPlayer from "react-audio-player";
import { AudioPlayer } from "react-audio-player-component";
import { Checkbox } from "../ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

export default function Notify() {
    const handleClick = () => {
        console.log('clicado')
    }
  return (
    <Card className="min-w-[700px] w-fit h-fit p-2">
      <CardHeader className="flex  w-full justify-between gap-4">
        <CardTitle>
          <p>Audio</p>
          <CardDescription>Selecione um audio padrão</CardDescription>
        </CardTitle>
        <Button onClick={() => handleClick}>Salvar</Button>
      </CardHeader>
      <div className="bg-card justify-center items-center gap-2 h-fit">
        <div className="items-center flex space-x-2 p-2 ">
          <Checkbox id="beep"/>
          <AudioPlayer
            src={beep}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>A1</p>
        </div>
        <div className="items-center flex space-x-2 p-2 ">
          <Checkbox id="minor"/>
          <AudioPlayer
            src={minor}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>A2</p>
        </div>
        <div className="items-center flex space-x-2 p-2 ">
          <Checkbox id="mobile"/>
          <AudioPlayer
            src={mobile}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>A3</p>
        </div>
        <div className="items-center flex space-x-2 p-2 ">
          <Checkbox id="suspicius"/>
          <AudioPlayer
            src={suspiciou}
            minimal={true}
            width={300}
            trackHeight={20}
            barWidth={1}
            gap={2}
            visualise={false}
            backgroundColor="#1e293b"
            barColor="#1e293b"
            barPlayedColor="#ffffff"
            skipDuration={2}
            showLoopOption={false}
            showVolumeControl={false}
          />
          <p>A4</p>
        </div>
      </div>
    </Card>
  );
}
