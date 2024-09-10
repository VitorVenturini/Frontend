import React, { ChangeEvent, useState, useEffect } from "react";
import { useButtons, ButtonInterface } from "../buttonContext/ButtonsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardDescription } from "@/components/ui/card";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import AlarmButton from "../alarm/AlarmButton";
import SensorButton from "@/components/sensor/SensorButton";
import CommandButton from "../command/CommandButton";
import NumberButton from "../number/NumberButton";
import UserButton from "../user/UserButton";
import { useDrag } from "react-dnd";
import { commonClasses } from "../ButtonsComponent";

interface DraggableButtonProps {
  button: ButtonInterface;
  children: React.ReactNode;
}

const DraggableButton: React.FC<DraggableButtonProps> = ({
  button,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "button",
    item: { ...button },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "copy",
      }}
    >
      {children}
    </div>
  );
};

interface ComboCardButtonsProps {
  selectedUser: UserInterface | null;
  onButtonDrop: (button: ButtonInterface) => void;
  removedButtons: ButtonInterface[]; // Botões removidos
}

export default function ComboCardButtons({
  selectedUser,
  onButtonDrop,
  removedButtons,
}: ComboCardButtonsProps) {
  const [filteredButtons, setFilterButtons] = useState("");
  const { buttons } = useButtons();
  
  // Filtra os botões do usuário selecionado, exceto os removidos
  const availableButtons = buttons.filter(
    (btn) =>
      btn.button_user === selectedUser?.guid &&
      !removedButtons.some((removed) => removed.id === btn.id) // Removidos da lista
  );

  const handleFilterButtons = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterButtons(event.target.value);
  };

  const buttonsToShow = availableButtons.filter((button: ButtonInterface) => {
    const normalizedButtonName = button.button_name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const normalizedFilter = filteredButtons
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return (
      normalizedButtonName.includes(normalizedFilter) &&
      button.button_type !== "combo" && button.button_type !== "sensor"
    );
  });

  const renderButtonContent = (button: ButtonInterface) => {
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

  return (
    <div className="flex flex-col w-[50%]">
      <h1>Selecione o botão</h1>
      <CardDescription>
        Arraste para o lado o botão na posição desejada
      </CardDescription>
      <Label
        className="text-end flex w-full items-center justify-center h-[30px]"
        htmlFor="buttonName"
      >
        Filtrar o botão
      </Label>
      <Input
        className="w-full"
        id="buttonName"
        placeholder="Filtrar..."
        value={filteredButtons}
        onChange={handleFilterButtons}
      />
      <div className="h-[250px] border border-input mt-2 w-full overflow-y-auto">
        <div className="w-full flex flex-wrap gap-2">
          {buttonsToShow.map((button: ButtonInterface) => (
            <DraggableButton key={button.id} button={button}>
              {renderButtonContent(button)}
            </DraggableButton>
          ))}
        </div>
      </div>
    </div>
  );
}
