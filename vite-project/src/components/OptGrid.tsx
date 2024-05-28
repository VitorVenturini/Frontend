import { Separator } from "@/components/ui/separator";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import ButtonsComponent from "./ButtonsComponent";
import { useState } from 'react';
import OptComponent from "./OptComponent";

interface OptGridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
//   selectedPage : string
}

interface User {
  id: string;
  name: string;
  guid: string;
}

export default function OptGrid({ buttons, selectedUser, selectedOpt}: OptGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{i: number, j: number} | null>(null);
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

  return (
    <div className="grid grid-rows-2 grid-cols-6 gap-2">
      {grid.map((row, i) =>
        row.map((button, j) => (
          <div key={`${i}-${j}`}>
            <OptComponent
              button={button}
              selectedUser ={selectedUser}
              clickedPosition={clickedPosition}
              selectedOpt = {selectedOpt}
              onClick={() => {
                //console.log(`X: ${button.position_x}, Y: ${button.position_y}`);
                console.log(`Clicked position state:`, "i: "+clickedPosition?.i + " j: " + clickedPosition?.j)
                setClickedPosition({i: i+1, j: j+1});
                console.log(`Clicked position state:`, "i: "+clickedPosition?.i + " j: " + clickedPosition?.j);
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}