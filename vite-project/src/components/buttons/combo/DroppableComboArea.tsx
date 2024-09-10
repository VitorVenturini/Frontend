import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { CardDescription } from "@/components/ui/card";
import { ButtonInterface } from "../buttonContext/ButtonsContext";
import AlarmButton from "../alarm/AlarmButton";
import SensorButton from "@/components/sensor/SensorButton";
import CommandButton from "../command/CommandButton";
import NumberButton from "../number/NumberButton";
import UserButton from "../user/UserButton";
import { commonClasses } from "../ButtonsComponent";

const renderButtonByType = (button: ButtonInterface | null) => {
  if (!button) return null;

  switch (button.button_type) {
    case "alarm":
      return <AlarmButton button={button} />;
    case "command":
      return <CommandButton button={button} />;
    case "number":
      return <NumberButton button={button} />;
    case "user":
      return <UserButton button={button} />;
    default:
      return (
        <div className={`flex-col flex ${commonClasses}`}>
          <div className="font-bold">{button.button_name}</div>
          <div className="text-sm text-muted-foreground">
            {button.button_type}
          </div>
        </div>
      );
  }
};

interface DroppableComboAreaProps {
  onButtonDrop: (button: ButtonInterface) => void;
  onReturnButton: (button: ButtonInterface) => void; // Função para retornar o botão
}

export default function DroppableComboArea({
  onButtonDrop,
  onReturnButton,
}: DroppableComboAreaProps) {
  const [droppedButtons, setDroppedButtons] = useState<
    (ButtonInterface | null)[]
  >([null, null, null, null]);

  const handleReturnButton = (index: number) => {
    const button = droppedButtons[index];
    if (button) {
      onReturnButton(button); // Retorna o botão ao clicar no "X"
      setDroppedButtons((prev) => {
        const newButtons = [...prev];
        newButtons[index] = null;
        return newButtons;
      });
    }
  };

  const createDropHandler = (index: number) => {
    return useDrop({
      accept: "button",
      drop: (item: ButtonInterface) => {
        setDroppedButtons((prev) => {
          const newButtons = [...prev];
          newButtons[index] = item;
          return newButtons;
        });
        onButtonDrop(item); // Remove da lista ao soltar
      },
    })[1];
  };

  return (
    <div className="w-[50%]">
      <h1>Criação de combo</h1>
      <CardDescription>Arraste o botão desejado para a posição</CardDescription>
      <div className=" py-2 gap-3">
        {droppedButtons.map((button, index) => (
          <div
            key={index}
            ref={createDropHandler(index)}
            className="mb-2 w-full h-[80px] outline outline-2 border-xs border-muted outline-muted text-muted-foreground flex items-center"
          >
            <div className="w-full flex justify-center">Posição 1</div>
            {button ? (
              <div className="w-full flex justify-center">
                {renderButtonByType(button)}
                <button
                  className="absolute top-1 right-1 text-red-500"
                  onClick={() => handleReturnButton(index)}
                >
                  X
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                Solte o botão aqui
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
