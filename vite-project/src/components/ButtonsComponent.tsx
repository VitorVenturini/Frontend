import React, { useContext } from "react";
import { Plus, OctagonAlert, User, Phone, Layers3, Rss, Siren } from "lucide-react";
import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import { useState } from "react";
import { Button } from "./ui/button";
import CardSensorModal from "./CardSensorModal";

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
  selectedUser: User | null;
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
    //if (!clickedPosition) return null;

    switch (true) {
      case clickedPosition?.i === 1 && selectedPage !== "0":
        return (
          <>
            <DialogTitle>Criar Combo</DialogTitle>
            <DialogDescription>
              Detalhes específicos para a criação de Combos.
              <p>
                Posição Y {clickedPosition?.j}
                Posição X {clickedPosition?.i}
              </p>
            </DialogDescription>
          </>
        );
      case clickedPosition?.i === 2 && selectedPage !== "0":
        return (
          <CardSensorModal selectedPage={selectedPage} selectedUser={selectedUser} clickedPosition={clickedPosition} />
        );
      case clickedPosition?.i && selectedPage === "0":
        return (
          <>
            <DialogTitle>Criar Dest</DialogTitle>
            <DialogDescription>
              Detalhes específicos para a criação de Dests.
              <p>
                Posição Y {clickedPosition?.j}
                Posição X {clickedPosition?.i}
              </p>
            </DialogDescription>
          </>
        );
      case (clickedPosition?.i ?? 0) >= 3 && (clickedPosition?.i ?? 0) <= 8:
        return (
          <>
            <DialogTitle>Criar Outro Tipo de Botão</DialogTitle>
            <DialogDescription>
              <p>
                Posição X {clickedPosition?.i}
                Posição Y {clickedPosition?.j}
              </p>
              Detalhes específicos para a criação de outro tipo de botão.
            </DialogDescription>
          </>
        );
      default:
        return (
          <>
            <DialogTitle>Criar um botão</DialogTitle>
          </>
        );
    }
  };

  const commonClasses =
    "w-[120px] h-[55px] rounded-lg border bg-border text-card-foreground shadow-sm p-1";

  const destClasses =
    "w-[100px] h-[55px] rounded-lg border bg-border text-card-foreground shadow-sm p-1";

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
            <p className="text-sm font-medium leading-none">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
          </div>
        </div>
      );
    case "dest":
      return (
        <div className={`${destClasses} flex flex-col`} onClick={onClick}>
          <div className="flex items-center gap-1">
            <Siren />
            <p className="text-sm font-medium leading-none">{button.button_name} </p>
          </div>
          <div>
            <p>{button.button_prt}</p>
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
              {selectedPage === "0" ? ( // quando for dests (pagina 0) entao adicinamos a classe destClasses
                <div
                  className={`${destClasses} flex items-center justify-center`}
                  onClick={handleClick}
                >
                  <Plus />
                </div>
              ) : ( // quando for botões normais adicionamos commonClasses
                <div
                  className={`${commonClasses} flex items-center justify-center`}
                  onClick={handleClick}
                >
                  <Plus />
                </div>
              )}


            </DialogTrigger>
            {<DialogContent>
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
            </DialogContent>}
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
