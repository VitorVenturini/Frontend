import {
  MoveRight,
  MoveLeft,
  MoveUp,
  MoveDown,
  Circle,
  Undo,
  CornerDownRight,
  CornerDownLeft,
  CornerLeftUp,
  Redo2,
  CornerLeftDown,
  CornerUpRight,
  CornerUpLeft,
  CornerRightUp,
  CornerRightDown,
  Undo2,
} from "lucide-react";

interface PeopleFlowParameters {
  a_to_a: number;
  a_to_b: number;
  a_to_c: number;
  a_to_d: number;
  b_to_a: number;
  b_to_b: number;
  b_to_c: number;
  b_to_d: number;
  c_to_a: number;
  c_to_b: number;
  c_to_c: number;
  c_to_d: number;
  d_to_a: number;
  d_to_b: number;
  d_to_c: number;
  d_to_d: number;
  date: string;
}

interface SquareProps {
  data: PeopleFlowParameters;
}

export default function Square({ data }: SquareProps) {
  const directionMap: Record<string, JSX.Element> = {
    a_to_a: <Undo2 className="rotate-90" />,
    a_to_b: <CornerDownRight />,
    a_to_c: <MoveDown />,
    a_to_d: <CornerDownLeft />,

    b_to_a: <CornerLeftUp />,
    b_to_b: <Redo2 />,
    b_to_c: <CornerLeftDown />,
    b_to_d: <MoveLeft />,

    c_to_a: <MoveUp />,
    c_to_b: <CornerUpRight />,
    c_to_c: <Redo2 className="rotate-90" />,
    c_to_d: <CornerUpLeft />,

    d_to_a: <CornerRightUp />,
    d_to_b: <MoveRight />,
    d_to_c: <CornerRightDown />,
    d_to_d: <Undo2 />,
  };
  console.log("DIRECTION" + JSON.stringify(data));

  const getArrowDirection = () => {
    // Encontrar a primeira direção com valor maior que zero
    const direction = Object.entries(data).find(
      ([key, value]) => key.includes("_to_") && value > 0
    );

    // Retorna a seta correspondente ou um círculo se não houver valores maiores que zero
    return direction ? directionMap[direction[0]] : <Circle />;
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32 border border-muted-foreground">
      {/* Seta no centro */}
      <span className="text-muted-foreground text-2xl">
        {getArrowDirection()}
      </span>

      {/* Letras posicionadas ao redor do quadrado */}
      <div
        className={`absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-muted-foreground text-lg font-bold`}
      >
        A
      </div>
      <div
        className={`absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-bold`}
      >
        B
      </div>
      <div
        className={`absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-muted-foreground text-lg font-bold`}
      >
        C
      </div>
      <div
        className={`absolute left-[-30px] top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-bold`}
      >
        D
      </div>
    </div>
  );
}
