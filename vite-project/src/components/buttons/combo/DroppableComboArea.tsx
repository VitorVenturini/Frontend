import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { CardDescription } from "@/components/ui/card";
import { ButtonInterface } from "../buttonContext/ButtonsContext";
import AlarmButton from "../alarm/AlarmButton";
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
  onReturnButton: (button: ButtonInterface) => void;
  updateCombos: (droppedButtons: (ButtonInterface | null)[]) => void;
  existingDroppedButtons: (ButtonInterface | null)[]; // Recebe os botões existentes
  isUpdate?: boolean;
}

export default function DroppableComboArea({
  onButtonDrop,
  onReturnButton,
  updateCombos,
  existingDroppedButtons,
  isUpdate = false,
}: DroppableComboAreaProps) {
  const [droppedButtons, setDroppedButtons] = useState<
    (ButtonInterface | null)[]
  >([null, null, null, null]);

  // Carrega os botões existentes ao montar o componente se estiver em modo de atualização
  useEffect(() => {
    if (isUpdate) {
      setDroppedButtons(existingDroppedButtons);
    }
  }, [isUpdate]);

  const handleReturnButton = (index: number) => {
    const button = droppedButtons[index];
    if (button) {
      setDroppedButtons((prev) => {
        const newButtons = [...prev];
        newButtons[index] = null; // Remove o botão da área de drop
        updateCombos(newButtons); // Atualiza o estado dos combos
        return newButtons;
      });
      onReturnButton(button); // Adiciona o botão de volta à lista disponível
    }
  };

  const createDropHandler = (index: number) => {
    return useDrop({
      accept: "button",
      drop: (item: ButtonInterface) => {
        if (droppedButtons[index]) {
          return null; // Se já houver um botão, não permite soltar outro
        }
        setDroppedButtons((prev) => {
          const newButtons = [...prev];
          newButtons[index] = item;
          updateCombos(newButtons);
          return newButtons;
        });
        onButtonDrop(item); // Remove da lista de disponíveis ao soltar
      },
      canDrop: () => !droppedButtons[index], // Permite soltar apenas se a posição estiver vazia
    })[1];
  };

  return (
    <div className="w-[50%]">
      <h1>Criação de combo</h1>
      <CardDescription>Arraste o botão desejado para a posição</CardDescription>
      <div className="py-2 gap-3">
        {droppedButtons.map((button, index) => (
          <div
            key={index}
            ref={createDropHandler(index)}
            className="relative mb-2 w-full h-[80px] outline outline-2 border-xs border-muted outline-muted text-muted-foreground flex items-center"
          >
            <div className="w-full flex flex-col justify-center items-center">
              <div>Posição {index + 1}</div>
              {button?.page === "0" ? (
                <p className="text-sm">
                  {button.position_y === "1"
                    ? "Em Cima"
                    : button.position_y === "2"
                    ? "Em Baixo"
                    : ""}
                </p>
              ) : (
                <p className="text-sm">
                  {button?.button_type === "number"
                    ? "Em Baixo"
                    : button?.button_type === "user"
                    ? "Em Baixo"
                    : ""}
                </p>
              )}
            </div>

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
