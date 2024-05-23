import React, { useContext } from "react";
import { Plus, OctagonAlert, User, Phone, Layers3, Rss } from "lucide-react";
import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import { useState } from "react";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

interface ButtonProps {
  button: ButtonInterface;
  onClick: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser : User,
  selectedPage: string
}

// ws.current?.send(JSON.stringify({ 
//   api: account.isAdmin ? "admin" : "user",
//    mt: "InsertMessage",
//    name: "Botão Teste page",
//    user: String(""),
//    value : "1005",
//    guid : "487675116219135218",
//    type : "number",
//    page: "2",
//    x: "2",
//    y: "2"

//   }));

export default function ButtonsComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedPage
}: ButtonProps) {
  const { isAdmin } = useContext(AccountContext);

  const handleClick = () => {
    onClick();
  };

  const commonClasses =
    "min-w-[120px] h-[55px] rounded-lg border bg-border text-card-foreground shadow-sm p-1";

  switch (button.button_type) {
    case "alarm":
      return (
        <div className={`${commonClasses} flex flex-col`}>
          <div className="flex items-center">
            <OctagonAlert />
            <p className="ml-2">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "user":
      return (
        <div className={`${commonClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center">
            <User />
            <p className="ml-2">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "number":
      return (
        <div className={`${commonClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center">
            <Phone />
            <p className="ml-2">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "combo":
      return (
        <div className={`${commonClasses} flex`} onClick={onClick}>
          <div className="flex items-center">
            <Layers3 />
            <p className="ml-2">Nome </p>
          </div>
        </div>
      );
    case "sensor":
      return (
        <div className={`${commonClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center">
            <Rss />
            <p className="ml-2">Nome </p>
          </div>
          <div>
            <p>Parâmetro</p>
          </div>
        </div>
      );
    default:
      if (isAdmin) {
        return (
          <Dialog>
            <DialogTrigger>
              <div
                className={`${commonClasses} flex items-center justify-center`}
                onClick={handleClick}
              >
                <Plus />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar um botão</DialogTitle>
                {clickedPosition && (
                  <p>
                    Clicked position: X: {clickedPosition.i}, Y:{" "}
                    {clickedPosition.j}

                  </p>
                )}
                <p>
                  Usuário: {selectedUser.name}
                </p>
                <p>
                  Página: {selectedPage}
                </p>

              </DialogHeader>
            </DialogContent>
            <DialogFooter>
              <Button>Criar</Button>
            </DialogFooter>
          </Dialog>
        );
      } else {
        return (
          <div className={`${commonClasses} flex items-center justify-center`}>
            
          </div>
        );
      }
  }
}
