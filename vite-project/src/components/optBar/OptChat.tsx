import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UserInterface } from "../users/usersCore/UserContext";
import ChatLayout from "../chat/ChatLayout";
import { useEffect, useState } from "react";

interface OptChatProps {
  userToChat: UserInterface;
  onClick: () => void;
}

export default function OptChat({ userToChat,onClick }: OptChatProps) {
  const [open, setOpen] = useState(false);
  const [userToChatState, setUserToChat] = useState<UserInterface | null>(null);
  
  useEffect(() => {
    if (userToChat) {
      setUserToChat(userToChat);
      setOpen(true); 
    } else {
      setOpen(false); 
      setUserToChat(null);
    }
  }, [userToChat]);

  const handleOpenChange = (isOpen: boolean) => {
    //setOpen(isOpen); // Atualiza o estado de abertura
    if (!isOpen) {
      console.log("O SheetContent foi fechado");
      setUserToChat(null);
      onClick() // limpar o usuario selecionado para entrar no useEffect acima 
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="!block">
        {userToChatState && <ChatLayout userToChat={userToChatState} />}
      </SheetContent>
    </Sheet>
  );
}
