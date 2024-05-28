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

export default function RightGrid({ buttons, selectedUser, selectedOpt }: RightGridProps) {

  const buttonsInSelectedOpt = buttons.filter(
    (button) => button.button_type === selectedOpt && button.page === "0"
  );

  return (
    <Card className="p-3 min-w-[400px] h-[500px] flex flex-col max-w-[500px] gap-1 items-center">
      {selectedUser && (
        <div className="flex-grow w-full">
          {<OptGrid buttons={buttonsInSelectedOpt} selectedUser={selectedUser} selectedOpt={selectedOpt} />}
        </div>
      )}
    </Card>
  );
}
