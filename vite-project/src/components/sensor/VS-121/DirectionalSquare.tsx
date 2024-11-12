import { MoveRight, MoveLeft, MoveUp, MoveDown, Circle } from "lucide-react";

interface SquareProps {
  from: string;
  to: string;
}

export default function Square({ from, to }: SquareProps) {
  const directionMap: Record<string, JSX.Element> = {
    "A-B": <MoveRight />,
    "B-C": <MoveDown />,
    "C-D": <MoveLeft />,
    "D-A": <MoveUp />,
    "A-D": <MoveLeft />,
    "D-C": <MoveDown />,
    "C-B": <MoveRight />,
    "B-A": <MoveUp />,
  };

  const getArrowDirection = () => directionMap[`${from}-${to}`] || <Circle />;

  return (
    <div className="relative flex items-center justify-center w-32 h-32 border border-muted-foreground">
      {/* Seta no centro */}
      <span className="text-muted-foreground text-2xl">
        {getArrowDirection()}
      </span>

      {/* Letras posicionadas ao redor do quadrado */}
      <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-muted-foreground text-lg font-bold">
        A
      </div>
      <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-bold">
        B
      </div>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-muted-foreground text-lg font-bold">
        C
      </div>
      <div className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-bold">
        D
      </div>
    </div>
  );
}
