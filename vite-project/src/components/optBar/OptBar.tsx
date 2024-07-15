import { Table } from "lucide-react";
import { useEffect, useState } from "react";
import { TabsOpt, TabsList, TabsTrigger, TabsContent } from "./Opt";
import { Map, MapPin, Rss, Radio, Video, MessageSquare } from "lucide-react";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { ChatInterface, useChat } from "../chat/ChatContext";
type OnOptChange = (opt: string) => void;

interface OtpRowProps {
  onOptChange: OnOptChange;
  clickedUser: string | null
}

export default function OptBar({ onOptChange,clickedUser }: OtpRowProps) {
  const { language } = useLanguage();
  const { chat, addChat, addChatMessage } = useChat();
  const [newMessageReceived, setNewMessageReceived] = useState(false);
  const myAccountInfo = JSON.parse(localStorage.getItem("Account") || "{}");

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt);
  };

  // useEffect(() => {
  //   // ajustar aqui tbm , filtrar pela ultima mensagem de cada usuario 
  //   const lastMessage = chat[chat.length - 1];
  //   if (lastMessage) {
  //     if (lastMessage.to_guid === myAccountInfo.guid && clickedUser != lastMessage.from_guid) {
  //       setNewMessageReceived(true); // marca que uma nova mensagem foi recebida
  //     }else if(clickedUser === lastMessage.from_guid){
  //       setNewMessageReceived(false);  //quando abrir o chat com o cara que me mandou a mensagem , entao some o ping vermelho
  //     }
  //   }
  // }, [addChat]); // useEffect para quando eu receber uma mensagem

  useEffect(() => {
    // Verifica se há mensagens não lidas
    let hasUnreadMessage = false;
  
    // Percorre todas as mensagens do chat
    chat.forEach((message) => {
      // Verifica se a mensagem é para o seu guid e não foi lida
      if (message.to_guid === myAccountInfo.guid && message.read === null) {
        // Verifica se o chat está aberto com o remetente da mensagem
        if (!clickedUser || message.from_guid !== clickedUser) {
          hasUnreadMessage = true;
        }
      }
    });
  
    // Atualiza o estado de nova mensagem recebida
    setNewMessageReceived(hasUnreadMessage);
  }, [addChat]);
  console.log("Contexto de Mensagens" + JSON.stringify(chat))
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
