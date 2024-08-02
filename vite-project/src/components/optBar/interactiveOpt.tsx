import React, { useEffect } from "react";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import OptGrid from "@/components/optBar/OptGrid";
import OptLayoutCopy from "./OptLayout copy";
import OptHistory from "./OptHistory";

interface User {
  id: string;
  name: string;
  guid: string;
}

interface InteractiveOptProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  interactive: string;
  clickedUser: string | null;
  setClickedUser: (newUser: string | null) => void;
  setClickedButtonIdTop: (id: number | null) => void;
  clickedButtonIdTop: number | null;
  setClickedButtonIdBottom: (id: number | null) => void;
  clickedButtonIdBottom: number | null;
}

export default function InteractiveOpt({
  buttons,
  selectedUser,
  selectedOpt,
  interactive,
  clickedUser,
  setClickedUser,
  setClickedButtonIdTop,
  clickedButtonIdTop,
  setClickedButtonIdBottom,
  clickedButtonIdBottom
}: InteractiveOptProps) {

  useEffect(() => {
    if (interactive === "top") {
      setClickedButtonIdTop(null);
    } else {
      setClickedButtonIdBottom(null);
    }
    setClickedUser(null); 
  }, [selectedOpt]);

  const setClickedButtonId = (id: number | null, grid: string) => {
    if (grid === "top") {
      setClickedButtonIdTop(id);
    } else if (grid === "bottom") {
      setClickedButtonIdBottom(id);
    }
  };

  const clickedButtonId =
  interactive === "top" ? clickedButtonIdTop : clickedButtonIdBottom;


  if (selectedOpt === 'history') {
    return <OptHistory />; // nao carrega o grid 
  }
  return (
    <div className="flex flex-col gap-1 justify-start h-full w-full">
      <OptGrid
        interactive={interactive}
        buttons={buttons}
        selectedUser={selectedUser}
        selectedOpt={selectedOpt}
        setClickedUser={setClickedUser}
        clickedUser={clickedUser}
        setClickedButtonId={(id: number | null) =>
          setClickedButtonId(id, interactive)
        }
        clickedButtonId={clickedButtonId}
      />

      {(clickedButtonId || clickedUser) && (
        <OptLayoutCopy
          //selectedOpt = {selectedOpt}
          clickedButtonId={clickedButtonId}
          clickedUser={clickedUser}
        />
      )}
    </div>
  );
}
