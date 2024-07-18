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
import { CamerasInterface } from "./CameraContext";
interface DeleteCameraProps {
  id: string;
}
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

export default function DeleteCamera({ id }: DeleteCameraProps){
  const [camera] = useState<CamerasInterface[]>([]);
  const wss = useWebSocketData()

    const deleteCamera = async (id: string) => {
      console.log(`Delete Gateways id: ${id}`);
      wss?.sendMessage({
        api: 'admin',
        mt: 'DeleteCamera',
        id: id,
      })
    }

    const handleDelete = () => {
        deleteCamera(id);
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
                Ao apertar em confirmar esta Câmera será deletado
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