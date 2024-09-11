import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { CardDescription } from "@/components/ui/card";
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
}

export default function DroppableComboArea({
  onButtonDrop,
  onReturnButton,
  updateCombos,
  existingDroppedButtons,
  isUpdate = false,
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

  const countButtonsByPosition = (position: "1" | "2", page: string) => {
    return droppedButtons.filter(
      (btn) =>
        btn?.position_y === position &&
        btn?.page === page &&
        !["alarm", "command"].includes(btn?.button_type || "")
    ).length;
  };
  
  const canDropButton = (button: ButtonInterface, index: number) => {
    const countTopPage0 = countButtonsByPosition("1", "0");
    const countBottomPage0 = countButtonsByPosition("2", "0");
  
    // Verifica se o botão já existe na posição "Em Cima" (position_y === "1") e página "0"
    if (button.position_y === "1" && button.page === "0" && countTopPage0 >= 1) {
      toast({
        description: "Não pode adicionar mais de 1 botão na posição Em Cima",
      });
      return false;
    }
  
    // Verifica se já existe um botão qualquer na posição "Em Baixo" (que não seja number ou user)
    const hasNonNumberOrUserBottomButton = droppedButtons.some(
      (btn) =>
        btn?.position_y === "2" &&
        btn?.page === "0" &&
        !["number", "user", "alarm", "command"].includes(btn?.button_type || "")
    );
  
    // Se já houver um botão não "number" ou "user" na posição "Em Baixo", bloquear a adição de "number" ou "user"
    if (
      button.position_y === "2" &&
      ["number", "user"].includes(button.button_type) &&
      hasNonNumberOrUserBottomButton
    ) {
      toast({
        description: "Não pode adicionar mais de 1 botão na posição Em Baixo",
      });
      return false;
    }
  
    // Verifica se já existe um botão "number" ou "user" e tenta adicionar outro tipo de botão
    const hasNumberOrUserBottom = droppedButtons.some(
      (btn) =>
        btn?.position_y === "2" &&
        ["number", "user"].includes(btn?.button_type || "")
    );
  
    // Se houver botões "number" ou "user", impedir a adição de outros tipos de botão
    if (
      button.position_y === "2" &&
      !["number", "user", "alarm", "command"].includes(button.button_type) &&
      hasNumberOrUserBottom
    ) {
      toast({
        description: "Não pode adicionar mais de 1 botão na posição Em Baixo",
      });
      return false;
    }
  
    // Para botões do tipo "alarm" ou "command", permitir sempre a adição
    if (["alarm", "command"].includes(button.button_type)) {
      return true;
    }
  
    return true;
  };
  
  
  const handleReturnButton = (index: number) => {
    const button = droppedButtons[index];
    if (button) {
      setDroppedButtons((prev) => {
        const newButtons = [...prev];
        newButtons[index] = null;
        updateCombos(newButtons);
        return newButtons;
      });
      onReturnButton(button);
    }
  };

  const createDropHandler = (index: number) => {
    return useDrop({
      accept: "button",
      drop: (item: ButtonInterface) => {
        if (droppedButtons[index]) {
          return null;
        }

        if (canDropButton(item, index)) {
          setDroppedButtons((prev) => {
            const newButtons = [...prev];
            newButtons[index] = item;
            updateCombos(newButtons);
            return newButtons;
          });
          onButtonDrop(item);
        }
      },
      canDrop: () => !droppedButtons[index],
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
            className="relative mb-2 w-full h-[70px] xl:h-[77px] xl2:h-[90px] xl3:h-[112px] xl4:h-[139px] outline outline-2 border-xs border-muted outline-muted text-muted-foreground flex items-center"
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
              <div className="relative w-full flex justify-center items-center">
                <div className="relative inline-block">
                  <div className="pointer-events-none">
                    {renderButtonByType(button)}
                  </div>
                  <button
                    className="absolute top-[-8px] right-[-8px] bg-gray-200 text-black rounded-full w-6 h-6 flex justify-center items-center "
                    onClick={() => handleReturnButton(index)}
                  >
                    ✖
                  </button>
                </div>
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
