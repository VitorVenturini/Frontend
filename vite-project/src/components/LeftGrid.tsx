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
import React, { useState } from "react";
import HistoryGrid from "./HistoryGrid";

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
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);

  const filteredDestsButton = selectedUser
  ? buttons.filter((button) => button.button_type === "dest")
  : [];

  return (
    <Card className= "p-1 flex flex-col  gap-1 items-center ">
      <HistoryGrid />
       {selectedUser && (
          <div className="flex-grow w-full">
            {<DestGrid 
            setClickedButtonId={setClickedButtonId}
            clickedButtonId={clickedButtonId}
            buttons={filteredDestsButton} 
            selectedUser={selectedUser}/>}
          </div>
        )}
        
    </Card>
  );
}
