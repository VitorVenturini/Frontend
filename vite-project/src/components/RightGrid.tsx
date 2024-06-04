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
}

export default function RightGrid({
  buttons,
  selectedUser,
  selectedOpt,
}: RightGridProps) {
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);

  const buttonsInSelectedOpt = buttons.filter(
    (button) => button.button_type === selectedOpt && button.page === "0"
  );

  return (
    <Card className="min-w-[400px] h-[500px] flex flex-col max-w-[500px] gap-1 items-center">
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
              <OptRightBottom clickedButtonId={clickedButtonId} />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
