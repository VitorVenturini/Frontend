import { Separator } from "@/components/ui/separator";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import ButtonsComponent from "./ButtonsComponent";
import { useState } from 'react';

interface ButtonsGridProps {
  buttons: ButtonInterface[];
  selectedUser: User;
  selectedPage : string
}

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

export default function ButtonsGrid({ buttons, selectedUser, selectedPage }: ButtonsGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{i: number, j: number} | null>(null);
  // Crie uma matriz 8x5 preenchida com botões padrão
  const grid = Array(8)
    .fill(null)
    .map(() => Array(5).fill({ variant: "default" }));

  // Substitua os botões padrão pelos botões reais
  buttons.forEach((button) => {
    const x = Number(button.position_x);
    const y = Number(button.position_y);

    if (!isNaN(x) && !isNaN(y)) {
      grid[y - 1][x - 1] = button;
    }
  });

  return (
    <div className="grid grid-rows-8 grid-cols-5 gap-4">
      {grid.map((row, i) =>
        row.map((button, j) => (
          <div key={`${i}-${j}`}>
            <ButtonsComponent
              button={button}
              selectedUser ={selectedUser}
              selectedPage = {selectedPage}
              clickedPosition={clickedPosition}
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