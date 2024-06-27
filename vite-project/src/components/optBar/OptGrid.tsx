import { Separator } from "@/components/ui/separator";
import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
import { useState } from 'react';
import OptComponent from "@/components/optBar/OptComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

interface OptGridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  setClickedButtonId: (id: number | null) => void; 
  clickedButtonId: number | null;
//   selectedPage : string
}

interface User {
  id: string;
  name: string;
  guid: string;
}

export default function OptGrid({ buttons, selectedUser, selectedOpt, setClickedButtonId, clickedButtonId}: OptGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{i: number, j: number} | null>(null);
  const [isClicked, setIsClicked] = useState(false)
  const wss = useWebSocketData()
  const account = useAccount()

  console.log("Option Selecionada : " + selectedOpt)
  console.log("Buttons" + JSON.stringify(buttons))
  const grid = Array(2)
    .fill(null)
    .map(() => Array(6).fill({ variant: "default" }));

  buttons.forEach((button) => {
    const x = Number(button.position_x);
    const y = Number(button.position_y);

    if (!isNaN(x) && !isNaN(y)) {
      grid[y - 1][x - 1] = button;
    }
  });

  // const clickedButton = buttons.filter(button => button.id === clickedButtonId)[0];

  return (
    <div>
    <div className="grid grid-rows-2 grid-cols-6 gap-1">
      {grid.map((row, i) =>
        row.map((button, j) => (
          <div key={`${i}-${j}`}>
            <OptComponent
              button={button}
              selectedUser ={selectedUser}
              clickedPosition={clickedPosition}
              selectedOpt = {selectedOpt}
              isClicked={clickedButtonId === button.id} // true or false 
              onClick={() => {
                if(account.isAdmin){
                  setClickedPosition({i: i+1, j: j+1});
                  console.log(`Clicked position state:`, "i: "+clickedPosition?.i + " j: " + clickedPosition?.j);
                }else{ // usuario
                  if (clickedButtonId !== button.id && button.button_type === "sensor") {
                    wss?.sendMessage({ api: "user", mt: "SelectSensorHistory", sensor: button.button_prt  });
                  }
                    //setIsClicked(clickedButtonId === button.id ? false : true);
                    setClickedButtonId(clickedButtonId === button.id ? null : button.id);

                }
              }}
            />
          </div>
        ))
      )}
    </div>
    </div>

  );
}