import React, { useState } from "react";
import { Map, MapPin, Rss, Radio, Video, MessageSquare } from "lucide-react";


export default function OtpRow() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="flex justify-between gap-2">
       <div className="min-w-[100px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center">
      <div className="flex justify-center">
        <Map />
      </div>
      <div className="flex justify-center">Planta Baixa</div>
    </div>

    <div className="min-w-[100px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center">
      <div className="flex justify-center">
      <MapPin />
      </div>
      <div className="flex justify-center">Mapa</div>
    </div>

    <div className="min-w-[100px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center">
      <div className="flex justify-center">
      <Rss />
      </div>
      <div className="flex justify-center">Sensor</div>
    </div>

    <div className="min-w-[100px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center">
      <div className="flex justify-center">
      <Radio />
      </div>
      <div className="flex justify-center">Radio</div>
    </div>

    <div className="min-w-[100px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center">
      <div className="flex justify-center">
      <Video />
      </div>
      <div className="flex justify-center">Video</div>
    </div>

    <div className="min-w-[100px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center">
      <div className="flex justify-center">
      <MessageSquare />
      </div>
      <div className="flex justify-center">Chat</div>
    </div>

      </div>
   
    // <div
    //   className={`min-w-[120px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center ${isSelected ? 'bg-blue-500' : ''}`}
    //   onClick={() => setIsSelected(!isSelected)}
    // >

    // </div>
  );
}
