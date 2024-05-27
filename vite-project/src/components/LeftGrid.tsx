import { useAccount } from "@/components/AccountContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "./ButtonsContext";
import DestGrid from "./DestGrid";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

interface LeftGridProps{
  buttons: ButtonInterface[];
  selectedUser: User | null;
}

export default function LeftGrid({buttons, selectedUser} : LeftGridProps) {

  const filteredDestsButton = selectedUser
  ? buttons.filter((button) => button.button_type === "dest")
  : [];

  return (
    <Card className= "p-3 min-w-[324px] h-[500px] flex flex-col max-w-[500px] gap-3 items-center">
       {selectedUser && (
          <div className="flex-grow w-full">
            {<DestGrid buttons={filteredDestsButton} selectedUser={selectedUser}/>}
          </div>
        )}
    </Card>
  );
}
