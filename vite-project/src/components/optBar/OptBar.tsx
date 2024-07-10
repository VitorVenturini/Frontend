import { Table } from "lucide-react";
import { useEffect, useState } from "react";
import { TabsOpt, TabsList, TabsTrigger, TabsContent } from "./Opt";
import { Map, MapPin, Rss, Radio, Video, MessageSquare } from "lucide-react";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { useChat } from "../chat/ChatContext";
type OnOptChange = (opt: string) => void;

interface OtpRowProps {
  onOptChange: OnOptChange;
}

export default function OptBar({ onOptChange }: OtpRowProps) {
  const { language } = useLanguage();
  const { chat, addChat, addChatMessage } = useChat();
  const [newMessageReceived, setNewMessageReceived] = useState(false);
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt);
  };

  useEffect(() => {
    const lastMessage = chat[chat.length - 1];
    if (lastMessage) {
      if (lastMessage.to_guid === myAccountInfo.guid) {
        setNewMessageReceived(true); // marca que uma nova mensagem foi recebida
      }
    }
  }, [addChat]); // useEffect para quando eu receber uma mensagem
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
            <div className="flex items-center">
              <span className="mr-1">{texts[language].chat}</span>
              {newMessageReceived ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              ) : null}
            </div>
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="account"></TabsContent>
        <TabsContent value="password"></TabsContent> */}
      </TabsOpt>
    </div>
  );
}
