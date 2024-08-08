import React, { useState, useEffect } from "react";
import OptBar from "@/components/optBar/OptBar";

import InteractiveOpt from "./interactiveOpt";

import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { Card } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  guid: string;
}

interface InteractiveridCopyProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  interactive: string;
  onKeyChange: (key: string) => void;
  clickedUser?: string | null;
  setClickedUser?: (newUser: string | null) => void;
}

export default function InteractiveGridCopy({
  buttons,
  selectedUser,
  selectedOpt,
  onKeyChange,
  clickedUser,
  setClickedUser,
  interactive,
}: InteractiveridCopyProps) {
  const [clickedButtonIdTop, setClickedButtonIdTop] = useState<number | null>(
    null
  );
  const [clickedButtonIdBottom, setClickedButtonIdBottom] = useState<
    number | null
  >(null);

  const handleClickedUser = (newUser: string | null) => {
    if (setClickedUser) {
      setClickedUser(newUser);
    }
  };

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
    <Card className="flex items-center h-[305px] xl:h-[400px] w-full p-1 gap-1">
      {selectedUser && (
        <>
          <OptBar
            interactive ={interactive}
            onOptChange={handleOptChange}
            selectedOpt={selectedOpt}
            clickedUser={clickedUser}
          />
          <InteractiveOpt
            interactive={interactive}
            buttons={buttonsInSelectedOpt}
            selectedUser={selectedUser}
            selectedOpt={selectedOpt}
            setClickedUser={handleClickedUser}
            clickedUser={clickedUser as string | null}
            setClickedButtonIdTop={setClickedButtonIdTop}
            clickedButtonIdTop={clickedButtonIdTop}
            setClickedButtonIdBottom={setClickedButtonIdBottom}
            clickedButtonIdBottom={clickedButtonIdBottom}
          />
        </>
      )}
    </Card>
  );
}
