import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ButtonInterface } from "../buttonContext/ButtonsContext";
import AlarmButton from "../alarm/AlarmButton";
import CommandButton from "../command/CommandButton";
import NumberButton from "../number/NumberButton";
import UserButton from "../user/UserButton";
import { commonClasses } from "../ButtonsComponent";
import { useToast } from "@/components/ui/use-toast";

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
  onSelectDropArea: (area: string) => void; // Função para lidar com o clique nas divs
  selectedArea: string | null; // Indica a área selecionada
}

export default function DroppableComboArea({
  onButtonDrop,
  onReturnButton,
  updateCombos,
  existingDroppedButtons,
  isUpdate = false,
  onSelectDropArea,
  selectedArea, // Nova prop para indicar área selecionada
}: DroppableComboAreaProps) {
  const { toast } = useToast();
  const [droppedButtons, setDroppedButtons] = useState<
    (ButtonInterface | null)[]
  >([null, null, null, null]);

  useEffect(() => {
    if (isUpdate) {
      setDroppedButtons(existingDroppedButtons);
    }
  }, [isUpdate]);

  const handleDrop = (button: ButtonInterface, index: number) => {
    if (droppedButtons[index]) {
      return null; // Não permite substituir um botão já colocado
    }

    const newDroppedButtons = [...droppedButtons];
    newDroppedButtons[index] = button;
    setDroppedButtons(newDroppedButtons);
    updateCombos(newDroppedButtons); // Atualiza o combo
    onButtonDrop(button); // Dispara o evento de "drop"
  };

  const createDropHandler = (index: number, area: string) => {
    return useDrop({
      accept: "button",
      drop: (item: ButtonInterface) => {
        handleDrop(item, index);
      },
      canDrop: () => !droppedButtons[index] && area === selectedArea,
      // permite soltar o botão se a posição estiver vazia
    })[1];
  };

  const handleReturnButton = (index: number) => {
    const button = droppedButtons[index];
    if (button) {
      const newDroppedButtons = [...droppedButtons];
      newDroppedButtons[index] = null;
      setDroppedButtons(newDroppedButtons);
      updateCombos(newDroppedButtons);
      onReturnButton(button);
    }
  };

  const getBorderClass = (area: string) => {
    return selectedArea === area ? "border-red-500" : "border-muted";
  };

  return (
    <div className="w-[50%]">
      <div className="grid grid-cols-2">
        {/* Div esquerda em cima */}
        <div
          ref={createDropHandler(0, "top-left")}
          className={`border-2 p-4 cursor-pointer relative h-[150px] ${getBorderClass(
            "top-left"
          )}`}
          onClick={() => onSelectDropArea("top-left")}
        >
          {droppedButtons[0] ? (
            <div className="relative inline-block z-50">
              {renderButtonByType(droppedButtons[0])}
              <button
                className="z-200 absolute top-[-8px] right-[-8px] bg-gray-200 text-black rounded-full w-6 h-6 flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReturnButton(0);
                }}
              >
                ✖
              </button>
            </div>
          ) : (
            <div> Div Esquerda (Em Cima) </div>
          )}
        </div>

        {/* Div direita em cima */}
        <div
          ref={createDropHandler(2, "top-right")}
          className={`border-2 p-4 cursor-pointer relative h-[150px] ${getBorderClass(
            "top-right"
          )}`}
          onClick={() => onSelectDropArea("top-right")}
        >
          {droppedButtons[2] ? (
            <div className="relative w-full flex justify-center items-center">
              <div className="relative inline-block">
                {renderButtonByType(droppedButtons[2])}
                <button
                  className="absolute top-[-8px] right-[-8px] bg-gray-200 text-black rounded-full w-6 h-6 flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReturnButton(2);
                  }}
                >
                  ✖
                </button>
              </div>
            </div>
          ) : (
            <div> Div Direita (Em Cima)</div>
          )}
        </div>

        {/* Div esquerda embaixo */}
        <div
          ref={createDropHandler(1, "bottom-left")}
          className={`border-2 p-4 cursor-pointer relative h-[150px] ${getBorderClass(
            "bottom-left"
          )}`}
          onClick={() => onSelectDropArea("bottom-left")}
        >
          {droppedButtons[1] ? (
            <div className="relative w-full flex justify-center items-center">
              <div className="relative inline-block">
                {renderButtonByType(droppedButtons[1])}
                <button
                  className="absolute top-[-8px] right-[-8px] bg-gray-200 text-black rounded-full w-6 h-6 flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReturnButton(1);
                  }}
                >
                  ✖
                </button>
              </div>
            </div>
          ) : (
            <div>Div Esquerda (Em Baixo)</div>
          )}
        </div>

        {/* Div direita embaixo */}
        <div
          ref={createDropHandler(3, "bottom-right")}
          className={`border-2 p-4 cursor-pointer relative h-[150px] ${getBorderClass(
            "bottom-right"
          )}`}
          onClick={() => onSelectDropArea("bottom-right")}
        >
          {droppedButtons[3] ? (
            <div className="relative w-full flex justify-center items-center">
              <div className="relative inline-block">
                {renderButtonByType(droppedButtons[3])}
                <button
                  className="absolute top-[-8px] right-[-8px] bg-gray-200 text-black rounded-full w-6 h-6 flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReturnButton(3);
                  }}
                >
                  ✖
                </button>
              </div>
            </div>
          ) : (
            <div>Div Direita (Em Baixo)</div>
          )}
        </div>
      </div>
    </div>
  );
}
