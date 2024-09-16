import { MessageCircleWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ActionsInteface } from "./ActionsContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface NotifyActionsProps {
  id: string;
}

export default function NotifyActions({ id }: NotifyActionsProps) {
  const [notify] = useState<ActionsInteface[]>([]);
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { language } = useLanguage();

  const notifyActions = async (id: string) => {
    console.log(`Card de notificação Actions id: ${id}`);
    // wss?.sendMessage({
    //   api: 'admin',
    //   mt: 'DeleteActions',
    //   id: id,
    // })
  };

  const handle = () => {
    notifyActions(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon">
          <MessageCircleWarning size={23} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{texts[language].cardCreateWarning}</AlertDialogTitle>
          <AlertDialogDescription>
            {texts[language].underDevelopment}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{texts[language].cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handle}>{texts[language].labelConfirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
