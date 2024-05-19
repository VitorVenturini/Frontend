import React, { useContext } from 'react';
import { useAccount } from "@/components/AccountContext";
import { Button } from './ui/button';
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
  import { useWebSocketData } from './WebSocketProvider';// Importe o useWebSocketData


export default function Logout() {
    const { setAccount } = useAccount(); // Use o setAccount do AccountContext
    const ws = useWebSocketData();

    const handleLogout = () => {
      localStorage.clear();
      setAccount(null);
      if (ws) {
        ws.closeConnection(); // Fecha a conexão WebSocket
      }
    };

  return (
    <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="ghost"> Sair</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ao apertar em sair você será redirecionado para a página de
                  login
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <a
                    onClick={handleLogout}
                   
                    //fazer a logiga de sair aqui
                  >
                    Sair
                  </a>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
  );
}