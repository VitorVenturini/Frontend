import { Separator } from "@/components/ui/separator";
import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
import ButtonsComponent from "@/components/buttons/ButtonsComponent"
import { useState } from "react";
import { UserInterface } from "@/components/users/usersCore/UserContext";


interface ButtonsGridProps {
  buttons: ButtonInterface[];
  selectedUser: UserInterface | null;
  selectedPage: string;
}

export default function ButtonsGrid({
  buttons,
  selectedUser,
  selectedPage,
}: ButtonsGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{
    i: number;
    j: number;
  } | null>(null);

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
    <div className="grid grid-rows-8 grid-cols-5 gap-1">
      {grid.map((row, i) =>
        row.map((button, j) => (
          <div key={`${i}-${j}`}>
            <ButtonsComponent
              button={button}
              selectedUser={selectedUser}
              selectedPage={selectedPage}
              clickedPosition={clickedPosition}
              onClickPosition={() => {
                setClickedPosition({ i: i + 1, j: j + 1 });
                // console.log(
                //   `Clicked position state:`,
                //   "i: " + clickedPosition?.i + " j: " + clickedPosition?.j
                // );
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}
