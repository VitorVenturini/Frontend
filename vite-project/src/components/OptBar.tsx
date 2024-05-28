import { Table } from "lucide-react";
import { useState } from "react";
import { TabsOpt, TabsList, TabsTrigger, TabsContent } from "./Opt";
import { Map, MapPin, Rss, Radio, Video, MessageSquare } from "lucide-react";

type OnOptChange = (opt: string) => void;

interface OtpRowProps {
  onOptChange: OnOptChange;
}

export default function OptBar({ onOptChange }: OtpRowProps) {

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt); 
  };

  return (
    <div className="flex">
      <TabsOpt defaultValue="floor" onValueChange={handleOptChange}>
        <TabsList>
          <TabsTrigger value="floor" icon={Map}>
            Planta Baixa
          </TabsTrigger>
          <TabsTrigger value="maps" icon={MapPin}>
            Mapa
          </TabsTrigger>
          <TabsTrigger value="sensor" icon={Rss}>
            Sensor
          </TabsTrigger>
          <TabsTrigger value="radio" icon={Radio}>
            Radio
          </TabsTrigger>
          <TabsTrigger value="video" icon={Video}>
            Video
          </TabsTrigger>
          <TabsTrigger value="chat" icon={MessageSquare}>
            Chat
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="account"></TabsContent>
        <TabsContent value="password"></TabsContent> */}
      </TabsOpt>
    </div>
  );
}
