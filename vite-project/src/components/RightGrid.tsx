import React, { useState } from "react";
import OtpRow from "./OptBar";
import OptGrid from "./OptGrid";
import { ButtonInterface } from "./ButtonsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OptRightBottom from "./OptRightBottom";
interface User {
  id: string;
  name: string;
  guid: string;
}

interface RightGridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  onKeyChange: (key: string) => void;
}

export default function RightGrid({
  buttons,
  selectedUser,
  selectedOpt,
  onKeyChange
}: RightGridProps) {
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);

  const buttonsInSelectedOpt = buttons.filter(
    (button) => button.button_type === selectedOpt && button.page === "0"
  );

  return (
    <Card className="  flex flex-col  gap-1 items-center">
      {selectedUser && (
        <div className="w-full">
          <div className="flex-grow w-full p-1">
            {
              <OptGrid
                buttons={buttonsInSelectedOpt}
                selectedUser={selectedUser}
                selectedOpt={selectedOpt}
                setClickedButtonId={setClickedButtonId}
                clickedButtonId={clickedButtonId}
              />
            }
          </div>
          <div>
            {clickedButtonId && (
              <OptRightBottom clickedButtonId={clickedButtonId} onKeyChange={onKeyChange}/>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
