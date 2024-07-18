  import { Trash2 } from "lucide-react";
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
  import { GatewaysInterface } from "./GatewaysContext";
  interface DeleteGatewaysProps {
    id: string;
  }
  import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
  
  export default function DeleteGateways({ id }: DeleteGatewaysProps){
    const [gateways] = useState<GatewaysInterface[]>([]);
    const wss = useWebSocketData()
  
      const deleteGateways = async (id: string) => {
        console.log(`Delete Gateways id: ${id}`);
        wss?.sendMessage({
          api: 'admin',
          mt: 'DeleteGateway',
          id: id,
        })
      }
  
      const handleDelete = () => {
        deleteGateways(id);
        // toast({
        //   description: "Ação deletada com sucesso",
        // });
      };
    return(
        <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="ghost" size="icon">
                <Trash2 size={23} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ao apertar em confirmar este gateway será deletado
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
  }