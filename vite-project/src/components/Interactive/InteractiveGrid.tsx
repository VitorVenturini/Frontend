import React, { useState, useEffect } from "react";
import OptBar from "@/components/optBar/OptBar"

import OptGrid from "@/components/optBar/OptGrid";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OptRightBottom from "@/components/optBar/OptRightBottom";
interface User {
  id: string;
  name: string;
  guid: string;
}

interface InteractiveridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  onKeyChange: (key: string) => void;
  clickedUser?: string | null;
  setClickedUser?: (newUser: string | null) => void;
}

export default function InteractiveGrid({
  buttons,
  selectedUser,
  selectedOpt,
  onKeyChange,
  clickedUser,
  setClickedUser,
}: InteractiveridProps) {
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);
  // const [clickedUser, setClickedUser] = useState<string | null>(null);

  const handleClickedUser = (newUser: string | null) => {
    if (setClickedUser) {
      setClickedUser(newUser);
    }
  };

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt);
  };

  useEffect(() => {
    setClickedButtonId(null); // fechar a OptRightBottom
    handleClickedUser(null); // fechar o chat
  }, [selectedOpt]);

  // const buttonsInSelectedOpt = buttons.filter(
  //   (button) => button.button_type === selectedOpt && button.page === "0"
  // );
  const buttonsInSelectedOpt = buttons.filter((button) => {
    if (selectedOpt === "sensor" && button.page === "0") {
      // tratamento adicional para carregar sensor junto com camera na mesma aba da direita
      return button.button_type === "sensor" || button.button_type === "camera";
    } else {
      return button.button_type === selectedOpt && button.page === "0";
    }
  });
  return (
    <Card className="  flex flex-col items-center ">
      {selectedUser && (
        
        <div className="w-full flex p-1 gap-1">
          <OptBar />
          
          <div className="flex-grow w-full gap-1">
            {
              <OptGrid
                buttons={buttonsInSelectedOpt}
                selectedUser={selectedUser}
                selectedOpt={selectedOpt}
                setClickedUser={handleClickedUser}
                clickedUser={clickedUser as string | null}
                setClickedButtonId={setClickedButtonId}
                clickedButtonId={clickedButtonId}
              />
            }
              {(clickedButtonId || clickedUser) && (
              <OptRightBottom
                clickedButtonId={clickedButtonId}
                clickedUser={clickedUser as string | null}
                onKeyChange={onKeyChange}
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
