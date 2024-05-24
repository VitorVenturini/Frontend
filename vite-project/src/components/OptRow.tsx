import { Table } from "lucide-react";
import { TabsOpt, TabsList, TabsTrigger, TabsContent } from "./Opt";
import { Map, MapPin, Rss, Radio, Video, MessageSquare } from "lucide-react";

export default function OtpRow() {
  return (
    <div className="flex">
      <TabsOpt>
        <TabsList>
          <TabsTrigger value="PlantaBiaxa" icon={Map}>Planta Baixa</TabsTrigger>
          <TabsTrigger value="maps" icon={MapPin}>Mapa</TabsTrigger>
          <TabsTrigger value="sensor" icon={Rss}>Sensor</TabsTrigger>
          <TabsTrigger value="radio" icon={Radio}>Radio</TabsTrigger>
          <TabsTrigger value="video" icon={Video}>Video</TabsTrigger>
          <TabsTrigger value="chat" icon={MessageSquare}>Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="account"></TabsContent>
        <TabsContent value="password"></TabsContent>
      </TabsOpt>
    </div>
  );
}
