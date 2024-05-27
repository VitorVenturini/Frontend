import { ButtonInterface } from "./ButtonsContext";
import { useState } from "react";
import DestComponent from "./DestComponent";

interface User {
    id: string;
    name: string;
    guid: string;
    // Adicione aqui outros campos se necessário
  }
  
  interface DestGridProps{
    buttons: ButtonInterface[]
    selectedUser: User | null
  }

  export default function DestGrid({ buttons, selectedUser }: DestGridProps) {
    const [clickedPosition, setClickedPosition] = useState<{i: number, j: number} | null>(null);
    // Crie uma matriz 8x5 preenchida com botões padrão

    const grid = Array(3)
      .fill(null)
      .map(() => Array(3).fill({ variant: "default" }));
  
    // Substitua os botões padrão pelos botões reais
    buttons.forEach((button) => {
      const x = Number(button.position_x);
      const y = Number(button.position_y);
  
      if (!isNaN(x) && !isNaN(y)) {
        grid[y - 1][x - 1] = button;
      }
    });
  
    return (
      <div className="grid grid-rows-3 grid-cols-3 gap-3">
        {grid.map((row, i) =>
          row.map((button, j) => (
            <div key={`${i}-${j}`}>
              <DestComponent
                button={button}
                selectedUser ={selectedUser}
                clickedPosition={clickedPosition}
                selectedPage="0"
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