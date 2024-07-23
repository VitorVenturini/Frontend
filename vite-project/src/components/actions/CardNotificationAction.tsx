
  import { MessageCircleWarning } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import React, { useEffect, useState, ChangeEvent, useContext } from "react";
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
  interface NotifyActionsProps {
    id: string;
  }
  import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
  
  export default function NotifyActions({ id }: NotifyActionsProps){
    const [notify] = useState<ActionsInteface[]>([]);
    const {toast} = useToast()
    const wss = useWebSocketData()
  
      const notifyActions = async (id: string) => {
        console.log(`Card de notificação Actions id: ${id}`);
        // wss?.sendMessage({
        //   api: 'admin',
        //   mt: 'DeleteActions',
        //   id: id,
        // })
      }
  
      const handle = () => {
        notifyActions(id);

      };
    return(
        <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="ghost" size="icon">
                <MessageCircleWarning size={23} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Card create Warning</AlertDialogTitle>
                <AlertDialogDescription>
                  Em desenvolvimento
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handle}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
  }