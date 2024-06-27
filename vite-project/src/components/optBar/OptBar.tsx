import { Table } from "lucide-react";
import { useState } from "react";
import { TabsOpt, TabsList, TabsTrigger, TabsContent } from "./Opt";
import { Map, MapPin, Rss, Radio, Video, MessageSquare } from "lucide-react";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
type OnOptChange = (opt: string) => void;

interface OtpRowProps {
  onOptChange: OnOptChange;
}

export default function OptBar({ onOptChange }: OtpRowProps) {
  const { language } = useLanguage();

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt);
  };

  return (
    <div className="flex">
      <TabsOpt defaultValue="floor" onValueChange={handleOptChange}>
        <TabsList>
          <TabsTrigger value="floor" icon={Map}>
            {texts[language].floorPlan}
          </TabsTrigger>
          <TabsTrigger value="maps" icon={MapPin}>
            {texts[language].map}
          </TabsTrigger>
          <TabsTrigger value="sensor" icon={Rss}>
            {texts[language].sensor}
          </TabsTrigger>
          <TabsTrigger value="radio" icon={Radio}>
            {texts[language].radio}
          </TabsTrigger>
          <TabsTrigger value="video" icon={Video}>
            {texts[language].video}
          </TabsTrigger>
          <TabsTrigger value="chat" icon={MessageSquare}>
            {texts[language].chat}
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="account"></TabsContent>
        <TabsContent value="password"></TabsContent> */}
      </TabsOpt>
    </div>
  );
}
