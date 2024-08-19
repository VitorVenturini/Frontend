import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UserInterface } from "../users/usersCore/UserContext";
import ChatLayout from "../chat/ChatLayout";
import { useEffect, useState } from "react";

interface OptChatProps {
  userToChat: UserInterface;
}

export default function OptChat({ userToChat }: OptChatProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userToChat) {
      setOpen(true); // Abre o SheetContent quando `userToChat` estiver definido
    } else {
      setOpen(false); // Fecha o SheetContent quando `userToChat` estiver undefined
    }
  }, [userToChat]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen); // Atualiza o estado de abertura
    if (!isOpen) {
      console.log("O SheetContent foi fechado");
      // Aqui você pode adicionar qualquer ação que deseja executar ao fechar o Sheet
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="!block">
        <ChatLayout userToChat={userToChat} />
      </SheetContent>
    </Sheet>
  );
}
