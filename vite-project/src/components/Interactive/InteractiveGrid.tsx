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
import OptLayout from "../optBar/OptLayout";
interface User {
  id: string;
  name: string;
  guid: string;
}

interface InteractiveridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  interactive: string;
  onKeyChange: (key: string) => void;
  clickedUser?: string | null;
  setClickedUser?: (newUser: string | null) => void;
}

export default function InteractiveGridTop({
  buttons,
  selectedUser,
  selectedOpt,
  onKeyChange,
  clickedUser,
  setClickedUser,
  interactive
}: InteractiveridProps) {
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);
  // const [clickedUser, setClickedUser] = useState<string | null>(null);

  const handleClickedUser = (newUser: string | null) => {
    if (setClickedUser) {
      setClickedUser(newUser);
    }
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

  const handleOptChange = (newOpt: string) => {
    onKeyChange(newOpt);
  };


  return (
    <Card className="  flex flex-col items-center max-h-[400px]">
      {selectedUser && (
        
        <div className="w-full flex p-1 gap-1">
          <OptBar onOptChange={handleOptChange} selectedOpt={selectedOpt} clickedUser={clickedUser} />
          
          <div className="flex-grow w-full gap-1">
            {
              <OptGrid
                interactive = {interactive}
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
              <OptLayout
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
