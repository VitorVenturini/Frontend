import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import React, { useEffect, useState, ChangeEvent, useContext } from "react";
import { useWebSocketData } from "./WebSocketProvider";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import ModalDest from "./ModalDest";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleClick = () => {
    onClick();
  };

  const handleClickUpdate = () => {
    onClick();
    setIsUpdate(true);
    // Outras ações onClick aqui
  };

  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-muted text-card-foreground shadow-sm p-1";

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
          <Dialog>
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
