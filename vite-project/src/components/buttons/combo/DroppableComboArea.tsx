import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ButtonInterface } from "../buttonContext/ButtonsContext";
import AlarmButton from "../alarm/AlarmButton";
import CommandButton from "../command/CommandButton";
import NumberButton from "../number/NumberButton";
import UserButton from "../user/UserButton";
import { commonClasses } from "../ButtonsComponent";
import { useToast } from "@/components/ui/use-toast";
import CronometerButton from "../cronometer/cronometerButton";
import ClockmButton from "../Clock/ClockButton";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

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
    case "cronometer":
      return <CronometerButton button={button} />;
    case "clock":
      return <ClockmButton button={button} />;
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
  droppedButtons: (ButtonInterface | null)[]; // Nova prop para receber o estado droppedButtons
  setDroppedButtons: React.Dispatch<
    React.SetStateAction<(ButtonInterface | null)[]>
  >; // Nova prop para passar a função setDroppedButtons
}

export default function DroppableComboArea({
  onButtonDrop,
  onReturnButton,
  updateCombos,
  setDroppedButtons,
  droppedButtons,
  existingDroppedButtons,
  isUpdate = false,
  onSelectDropArea,
  selectedArea,
}: DroppableComboAreaProps) {
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    if (isUpdate) {
      setDroppedButtons(existingDroppedButtons);
    }
  }, [isUpdate]);

  const handleDrop = (button: ButtonInterface, index: number) => {
    const newDroppedButtons = [...droppedButtons];

    const rightAreaButtonsCount = [
      newDroppedButtons[2],
      newDroppedButtons[3],
    ].filter(Boolean).length;

    if (index === 2 || index === 3) {
      if (rightAreaButtonsCount >= 2) {
        toast({
          description: texts[language].maxButtonsRightSideMessage,
        });
        return;
      } else {
        const indexToUse = newDroppedButtons[2] === null ? 2 : 3;
        newDroppedButtons[indexToUse] = button;
        setDroppedButtons(newDroppedButtons);
        updateCombos(newDroppedButtons);
        onButtonDrop(button);
        return;
      }
    }
    newDroppedButtons[index] = button;
    setDroppedButtons(newDroppedButtons);
    updateCombos(newDroppedButtons);
    onButtonDrop(button);
  };

  const createDropHandler = (index: number, area: string) => {
    return useDrop({
      accept: "button",
      drop: (item: ButtonInterface) => {
        handleDrop(item, index);
      },
      canDrop: () => {
        const rightAreaButtonsCount = [
          droppedButtons[2],
          droppedButtons[3],
        ].filter(Boolean).length;

        if (area === "right-side") {
          if (rightAreaButtonsCount >= 2) {
            return false;
          } else {
            return area === selectedArea;
          }
        }
        return !droppedButtons[index] && area === selectedArea;
      },
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
      <div className="grid grid-cols-12 grid-rows-5 gap-4">
        {/* Div esquerda em cima */}
        <div
          ref={createDropHandler(0, "top-left")}
          className={`border-2 p-4 cursor-pointer relative h-[150px] row-span-2 col-span-6 items-center flex ${getBorderClass(
            "top-left"
          )}`}
          onClick={() => onSelectDropArea("top-left")}
        >
          {droppedButtons[0] ? (
            <div className="relative w-full flex justify-center items-center">
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
            </div>
          ) : (
            <div className="text-center w-full text-muted-foreground text-sm">
              {texts[language].selectAreaDropMessage}
            </div>
          )}
        </div>

        {/* Div direita unificada (em cima e embaixo) */}
        <div
          ref={createDropHandler(2, "right-side")}
          className={`border-2 p-4 cursor-pointer relative h-[320px] flex flex-col justify-evenly row-span-4 col-span-6 ${getBorderClass(
            "right-side"
          )}`}
          onClick={() => onSelectDropArea("right-side")}
        >
          {droppedButtons.map((button, realIndex) => {
            if (realIndex === 2 || realIndex === 3) {
              if (button) {
                return (
                  <div
                    className="relative w-full flex justify-center items-center"
                    key={realIndex}
                  >
                    <div className="relative inline-block">
                      {renderButtonByType(button)}
                      <button
                        className="absolute top-[-8px] right-[-8px] bg-gray-200 text-black rounded-full w-6 h-6 flex justify-center items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReturnButton(realIndex);
                        }}
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                );
              }
            }
            return null;
          })}
          {(() => {
            const rightButtonsCount = [
              droppedButtons[2],
              droppedButtons[3],
            ].filter(Boolean).length;

            if (rightButtonsCount === 0) {
              return (
                <div className="text-center w-full text-muted-foreground text-sm">
                  {texts[language].selectAreaDropMessage}
                </div>
              );
            } else if (rightButtonsCount === 1) {
              return (
                <div className="text-center w-full text-muted-foreground text-sm">
                  {texts[language].addOneMoreButtonMessage}
                </div>
              );
            }
          })()}
        </div>

        {/* Div esquerda embaixo */}
        <div
          ref={createDropHandler(1, "bottom-left")}
          className={`border-2 p-4 cursor-pointer relative h-[150px] row-span-4 col-span-6 items-center flex ${getBorderClass(
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
            <div className="text-center w-full text-muted-foreground text-sm">
              {texts[language].selectAreaDropMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
