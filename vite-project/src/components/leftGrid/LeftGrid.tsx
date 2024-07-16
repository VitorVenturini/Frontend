import { useAccount } from "@/components/account/AccountContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import DestGrid from "@/components/buttons/dest/DestGrid";
import React, { useState } from "react";
import HistoryGrid from "@/components/history/HistoryGrid";
import { ScrollArea } from "../ui/scroll-area";
interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

interface LeftGridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
}

export default function LeftGrid({ buttons, selectedUser }: LeftGridProps) {
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);
  const { isAdmin } = useAccount();
  const filteredDestsButton = selectedUser
    ? buttons.filter((button) => button.button_type === "dest")
    : [];

  return (
    <Card className="p-1 flex flex-col  gap-1 items-center ">
      {selectedUser && (
        <ScrollArea className="w-full min-h-[390px] max-h-[390px]">
          {!isAdmin && <HistoryGrid />}
        </ScrollArea>
      )}

      {/* So mostrar o histórico quando nao for admin */}

      {selectedUser && (
        <div className="flex-grow w-full">
          {
            <DestGrid
              setClickedButtonId={setClickedButtonId}
              clickedButtonId={clickedButtonId}
              buttons={filteredDestsButton}
              selectedUser={selectedUser}
            />
          }
        </div>
      )}
    </Card>
  );
}
