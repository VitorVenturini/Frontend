import React, { useContext } from "react";
import { Plus, OctagonAlert, User, Phone, Layers3, Rss } from "lucide-react";
import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import { useState } from "react";
import { Button } from "./ui/button";
import CreateSensorModal from "./CreateSensorModal";

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
  clickedPosition: { x: number; y: number } | null;
  selectedUser: User;
  selectedPage: string;
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
  selectedPage,
}: ButtonProps) {
  const { isAdmin } = useContext(AccountContext);

  const handleClick = () => {
    onClick();
  };


  const getDialogContent = () => {
    if (!clickedPosition) return null;

    switch (clickedPosition.x) {
      case 1:
        return (
          <>
            <DialogTitle>Criar Combo</DialogTitle>
            <DialogDescription>
              Detalhes específicos para a criação de Combos.
            </DialogDescription>
          </>
        );
      case 2:
        return (
          <CreateSensorModal selectedPage={selectedPage} selectedUser={selectedUser} clickedPosition={clickedPosition}/>
          // <>
          //    <DialogTitle>Criar Sensor</DialogTitle>
          //   <DialogDescription>
          //     Detalhes específicos para a criação de Sensores.
          //   </DialogDescription> 
          // </>
        );
      default:
        if (clickedPosition.x >= 3 && clickedPosition.x <= 8) {
          return (
            <>
              <DialogTitle>Criar Outro Tipo de Botão</DialogTitle>
              <DialogDescription>
                Detalhes específicos para a criação de outro tipo de botão.
              </DialogDescription>
            </>
          );
        }
        return (
          <>
            <DialogTitle>Criar um botão</DialogTitle>
          </>
        );
    }
  };
  const commonClasses =
    "w-[120px] h-[55px] rounded-lg border bg-border text-card-foreground shadow-sm p-1";

  switch (button.button_type) {
    case "alarm":
      return (
        <div className={`${commonClasses} flex flex-col`}>
          <div className="flex items-center gap-1">
            <OctagonAlert />
            <p className="text-sm font-medium leading-none">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "user":
      return (
        <div className={`${commonClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center gap-1">
            <User />
            <p className="text-sm font-medium leading-none">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "number":
      return (
        <div className={`${commonClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center gap-1">
            <Phone />
            <p className="text-sm font-medium leading-none">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "combo":
      return (
        <div className={`${commonClasses} flex`} onClick={onClick}>
          <div className="flex items-center gap-1">
            <Layers3 />
            <p className="text-sm font-medium leading-none">Nome </p>
          </div>
        </div>
      );
    case "sensor":
      return (
        <div className={`${commonClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center gap-1">
            <Rss />
            <p className="text-sm font-medium leading-none">Nome </p>
          </div>
          <div>
            <p>Parâmetro</p>
          </div>
        </div>
      );
    default:
      if (isAdmin) {
        return (
          // <div>
          // {getDialogContent()}
          // </div>
          <Dialog>
            <DialogTrigger>
              <div
                className={`${commonClasses} flex items-center justify-center`}
                onClick={handleClick}
              >
                <Plus />
              </div>
            </DialogTrigger>
            { <DialogContent>
              {getDialogContent()}
              {/* <DialogHeader>
               {clickedPosition && (
                  <p>
                    Clicked position: X: {clickedPosition.i}, Y:{" "}
                    {clickedPosition.j}
                  </p>
                )}
                <p>Usuário: {selectedUser.name}</p>
                <p>Página: {selectedPage}</p>
              </DialogHeader> */}
              <DialogFooter>
                {/* <Button>Criar</Button> */}
              </DialogFooter>
            </DialogContent> }
          </Dialog>
       );
      } else {
        return (
          <div
            className={`${commonClasses} flex items-center justify-center`}
          ></div>
        );
      }
  }
}
