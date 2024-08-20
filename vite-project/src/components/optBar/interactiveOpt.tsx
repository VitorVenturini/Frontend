import React, { useEffect, useState } from "react";
import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
import OptGrid from "@/components/optBar/OptGrid";
import OptLayoutCopy from "./OptLayout copy";
import OptHistory from "./OptHistory";
import { useWebSocketData } from "../websocket/WebSocketProvider";

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

  const { setStopCombo } = useButtons();
  
  const [comboButtonId, setComboButtonId] = useState<number | null>(null);
  const wss = useWebSocketData()
  // atualiza comboButtonId apenas quando os botões mudam
  useEffect(() => {
    const buttonInCombo = buttons.find(
      (button) => button.comboStart && button.position_y === (interactive === "top" ? "1" : "2")
    );
    if (buttonInCombo) {
      setComboButtonId(buttonInCombo.id);
    } else {
      setComboButtonId(null);
    }
  }, [buttons,interactive]);

  // verifica e para o combo ao trocar de opção
  useEffect(() => {
    if (comboButtonId !== null) {
      if ((interactive === "top" && clickedButtonIdTop === comboButtonId) ||
        (interactive === "bottom" && clickedButtonIdBottom === comboButtonId)) {
        setStopCombo(comboButtonId); // parar o combo do botão e fechar ele ao trocar de opt 
      }
    }
    if (interactive === "top") {
      setClickedButtonIdTop(null);
      if(selectedOpt === "chat"){
        wss?.sendMessage({
          api: "user",
          mt: "SelectAllMessagesSrc"
        })
      }
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
    <div className="flex flex-col gap-1 justify-start h-full w-[500px] xl:w-[700px] align-top">
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

      {(clickedButtonId) && (
        <OptLayoutCopy
          //selectedOpt = {selectedOpt}
          clickedButtonId={clickedButtonId}
          clickedUser={clickedUser}
        />
      )}
    </div>
  );
}
