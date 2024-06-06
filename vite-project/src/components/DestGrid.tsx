import { ButtonInterface } from "./ButtonsContext";
import { useState,  } from "react";
import DestComponent from "./DestComponent";
import { useAccount } from "./AccountContext";

interface User {
    id: string;
    name: string;
    guid: string;
    // Adicione aqui outros campos se necessário
  }
  
  interface DestGridProps{
    buttons: ButtonInterface[]
    selectedUser: User | null
    setClickedButtonId: (id: number | null) => void; 
    clickedButtonId: number | null;
  }

  export default function DestGrid({ buttons, selectedUser,setClickedButtonId, clickedButtonId }: DestGridProps) {
    const [clickedPosition, setClickedPosition] = useState<{i: number, j: number} | null>(null);
    const account = useAccount()
    const [isClicked, setIsClicked] = useState(false)
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
      <div className="grid grid-rows-3 grid-cols-3 gap-1">
        {grid.map((row, i) =>
          row.map((button, j) => (
            <div key={`${i}-${j}`}>
              <DestComponent
                button={button}
                selectedUser ={selectedUser}
                clickedPosition={clickedPosition}
                isClicked={clickedButtonId === button.id} // true or false 
                selectedPage="0"
                onClick={() => {
                  if(account.isAdmin){
                    setClickedPosition({i: i+1, j: j+1});
                  }else
                  {
                    setClickedButtonId(clickedButtonId === button.id ? null : button.id);
                  }
                }}
              />
            </div>
          ))
        )}
      </div>
    );
  }