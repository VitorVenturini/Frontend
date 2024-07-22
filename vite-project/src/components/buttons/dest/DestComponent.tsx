import { AccountContext } from "@/components/account/AccountContext"
import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
import React, { useEffect, useState, ChangeEvent, useContext } from "react";
import * as Icons from "lucide-react";
import ModalDest from "./ModalDest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  OctagonAlert,
  Megaphone,
  Home,
  Zap,
  Waves,
  User,
  Hospital,
  Phone,
  Flame,
  Layers3,
  Rss,
  Siren,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface DestProps {
  button: ButtonInterface;
  onClick: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedPage: string;
  isClicked: boolean;
}

export default function DestComponent({
  button,
  onClick,
  clickedPosition,
  selectedUser,
  selectedPage,
  isClicked,
}: DestProps) {
  const { isAdmin } = useContext(AccountContext);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    onClick();
  };

  const handleClickUpdate = () => {
    onClick();
    setIsUpdate(true);
    // Outras ações onClick aqui
  };

  const commonClasses =
    "w-[60px] h-[60px] xl:w-[70px] xl:h-[70px] 2xl:w-[80px] 2xl:h-[80px] rounded-lg border bg-muted text-card-foreground shadow-sm p-1";

  const getDialogContent = () => {
    return (
      <ModalDest   selectedPage={selectedPage}
      selectedUser={selectedUser}
      clickedPosition={clickedPosition}/>
    );
  };

  const renderButtonContent = () => {
    if (!button.button_type) {
      if (isAdmin) {
        return (
          // <div>
          // {getDialogContent()}
          // </div>
          <Dialog>
            <DialogTrigger>
              <div
                className={`${commonClasses} flex items-center justify-center `}
                onClick={handleClick}
              >
                <Plus />
              </div>
            </DialogTrigger>
            <DialogContent>{getDialogContent()}</DialogContent>
          </Dialog>
        );
      } else {
        return (
          <div
            className={`${commonClasses} flex items-center justify-center`}
          ></div>
        );
      }
    } else if (button.button_type === "dest") {
      let IconComponent: React.ElementType | null = null;
      if (button.img && Icons[button.img as keyof typeof Icons]) {
        IconComponent = Icons[
          button.img as keyof typeof Icons
        ] as React.ElementType;
      }
      return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              {isAdmin ? (
                // Renderiza a div com onClick apenas se o usuário for admin
                <div
                  className={`${commonClasses} flex flex-col items-center align-middle justify-center gap-1  ${
                    isClicked ? "bg-zinc-950" : ""
                  }`}
                  onClick={handleClickUpdate}
                >
                  {IconComponent && <IconComponent />}
                  <p className="text-sm font-medium leading-none">
                    {button.button_name}
                  </p>
                </div>
              ) : (
                // Renderiza a div sem onClick se o usuário não for admin
                <div
                  className={`${commonClasses} flex flex-col items-center align-middle justify-center gap-1  ${
                    isClicked ? "bg-zinc-950" : ""
                  }`}
                  onClick={handleClick}
                >
                  {IconComponent && <IconComponent />}
                  <p className="text-sm font-medium leading-none">
                    {button.button_name}
                  </p>
                </div>
              )}
            </DialogTrigger>
            {isAdmin && (
                  <div>
                    <DialogContent>
                      <ModalDest
                        selectedPage={selectedPage}
                        selectedUser={selectedUser}
                        clickedPosition={clickedPosition}
                        existingButton={button}
                        isUpdate={true}
                        onClose={() => setIsDialogOpen(false)}
                      />
                    </DialogContent>
                  </div>
                )}
          </Dialog>
        </div>
      );
    }
  };

  return renderButtonContent();
}
