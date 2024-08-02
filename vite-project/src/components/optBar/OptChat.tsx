import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserInterface } from "../user/UserContext";
import ChatLayout from "../chat/ChatLayout";


interface OptChatProps {
  userToChat: UserInterface;
}

export default function OptChat( { userToChat }: OptChatProps) {
  return (
    <Card className="h-full">
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <ChatLayout userToChat={userToChat} />
        </SheetContent>
      </Sheet>
    </Card>
  );
}
