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

export default function Logout() {
    const { setUser } = useAccount(); // Use o setAccount do AccountContext

  const handleLogout = () => {
    localStorage.clear(); // Limpe o localStorage
    setUser(null); // Atualize o AccountContext para nenhuma conta
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
                    href="/Login"
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