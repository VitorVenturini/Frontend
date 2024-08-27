import { History, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { TabsOpt, TabsList, TabsTrigger, TabsContent } from "./Opt";
import { Map, MapPin, Rss, Radio, Video, MessageSquare,Phone } from "lucide-react";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { ChatInterface, useChat } from "../chat/ChatContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import { useAccount } from "../account/AccountContext";

type OnOptChange = (opt: string) => void;

interface OtpRowProps {
  interactive: string;
  onOptChange: OnOptChange;
  clickedUser?: string | null;
  selectedOpt: string;
}

export default function OptBar({
  onOptChange,
  clickedUser,
  selectedOpt,
  interactive,
}: OtpRowProps) {
  const { language } = useLanguage();
  const { chat, addChat, addChatMessage } = useChat();
  const { buttons } = useButtons();
  const [newMessageReceived, setNewMessageReceived] = useState(false);
  const account = useAccount()
  const myAccountInfo = JSON.parse(localStorage.getItem(account.session) || "{}");
  const [initiatedByUser, setInitiatedByUser] = useState(false);

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt);
  };
  console.log(selectedOpt);

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

  return (
    <TabsOpt
      value={selectedOpt}
      className="h-full"
      onValueChange={handleOptChange}
    >
      <TabsList className="flex-col h-full justify-between">
        <TabsTrigger
          value="floor"
          className="w-full flex-row gap-1 h-full text-[0px] xl:text-sm"
          icon={Map}
        >
          {texts[language].floorPlan}
        </TabsTrigger>
        <TabsTrigger
          value="maps"
          className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
          icon={MapPin}
        >
          {texts[language].map}
        </TabsTrigger>
        <TabsTrigger
          value="sensor"
          className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
          icon={Rss}
        >
          {texts[language].sensor}
        </TabsTrigger>
        <TabsTrigger
          value="radio"
          className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
          icon={Radio}
        >
          {texts[language].radio}
        </TabsTrigger>
        <TabsTrigger
          value="video"
          className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
          icon={Video}
        >
          {texts[language].video}
        </TabsTrigger>
        <TabsTrigger
          value="call"
          className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
          icon={Phone}
        >
          Chamadas
        </TabsTrigger>
        {interactive === "top" ? (
          <TabsTrigger
            value="chat"
            className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
            icon={MessageSquare}
          >
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
        ) : (
          <TabsTrigger
            value="history"
            className="w-full flex-row gap-1 justify-start h-full text-[0px] xl:text-sm"
            icon={History}
          >
            Historico
          </TabsTrigger>
        )}
      </TabsList>
      {/* <TabsContent value="account"></TabsContent>
        <TabsContent value="password"></TabsContent> */}
    </TabsOpt>
  );
}
