import React, { ChangeEvent, useState } from "react";
import { useButtons, ButtonInterface } from "../buttonContext/ButtonsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardDescription } from "@/components/ui/card";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import AlarmButton from "../alarm/AlarmButton";
import CommandButton from "../command/CommandButton";
import NumberButton from "../number/NumberButton";
import UserButton from "../user/UserButton";
import { useDrag } from "react-dnd";
import { Skeleton } from "@/components/ui/skeleton";
import { commonClasses } from "../ButtonsComponent";
import { toast, useToast } from "@/components/ui/use-toast";
import CronometerButton from "../cronometer/cronometerButton";
import ClockButton from "../Clock/ClockButton";

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
  existingDroppedButtons: (ButtonInterface | null)[]; // Botões na área de drop
  onReturnButton: (button: ButtonInterface) => void; // Callback para retornar botão removido à lista de disponíveis
  selectedDropArea: string | null; // Adicionada prop para saber qual área foi clicada
  setDroppedButtons: React.Dispatch<React.SetStateAction<(ButtonInterface | null)[]>>;
  droppedButtons: (ButtonInterface | null)[];
}

export default function DraggableComboButtons({
  selectedUser,
  onButtonDrop,
  removedButtons,
  setDroppedButtons,
  droppedButtons,
  existingDroppedButtons,
  onReturnButton,
  selectedDropArea, // Recebe a área selecionada
}: ComboCardButtonsProps) {
  const [filteredButtons, setFilterButtons] = useState("");
  const { buttons } = useButtons();
  const { toast } = useToast();
  const handleFilterButtons = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterButtons(event.target.value);
  };

  const buttonsFromUser = buttons.filter((btn) => {
    return btn.button_user === selectedUser?.guid;
  });

  // Filtra os botões do usuário selecionado, exceto os removidos
  const availableButtons = buttonsFromUser.filter(
    (btn) =>
      !removedButtons.some((removed) => removed.id === btn.id) &&
      (btn.page === "0" ||
        (btn.button_type !== "sensor" &&
          btn.page !== "0" &&
          btn.button_type !== "combo")) // Removidos da lista
  );

  // Lógica para filtrar botões conforme a área selecionada
  const buttonsToShow = availableButtons.filter((button: ButtonInterface) => {
    const normalizedButtonName = button.button_name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const normalizedFilter = filteredButtons
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // Aplica o filtro de texto
    if (!normalizedButtonName.includes(normalizedFilter)) {
      return false;
    }

    // Somente exibir botões após uma área ser selecionada
    if (!selectedDropArea) return false;

    // Filtra os botões conforme a área selecionada
    if (selectedDropArea === "top-left") {
      return button.page === "0" && button.position_y === "1";
    } else if (selectedDropArea === "bottom-left") {
      return button.page === "0" && button.position_y === "2";
    } else if (selectedDropArea === "right-side") {
      return button.page !== "0";
    } else if (selectedDropArea === "right-side") {
      return button.page !== "0";
    }

    return true;
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
        case "cronometer":
          return <CronometerButton button={button} />;
          case "clock":
            return <ClockButton button={button} />;
      default:
        return (
          <div className={`flex-col flex ${commonClasses} cursor-pointer`}>
            <div className="font-bold">{button.button_name}</div>
            <div className="text-sm text-muted-foreground">
              {button.button_type}
            </div>
          </div>
        );
    }
  };

  const renderSkeletons = (length: number) => {
    return Array.from({ length }).map((_, index) => (
      <Skeleton key={index} className={commonClasses} />
    ));
  };

  const handleClickButton = (button: ButtonInterface) => {
    if (!selectedDropArea) {
      toast({
        description: "Selecione uma área para colocar o botão",
      });
      return;
    }
  
    // Definir o índice com base na área selecionada
    let indexToDrop = 0;
    switch (selectedDropArea) {
      case "top-left":
        indexToDrop = 0;
        break;
      case "bottom-left":
        indexToDrop = 1;
        break;
      case "right-side":
        // Verifica qual das duas áreas da direita está disponível
        const rightAreaButtonsCount = [droppedButtons[2], droppedButtons[3]].filter(Boolean).length;
        indexToDrop = droppedButtons[2] ? 3 : 2;
        if (rightAreaButtonsCount >= 2) {
          toast({
            description: "Você não pode adicionar mais de 2 botões nesta área.",
          });
          return;
        }
        break;
      default:
        return;
    }
  
    // Se já houver um botão na posição selecionada (top-left ou bottom-left), removê-lo
    const currentButton = droppedButtons[indexToDrop];
    if (currentButton) {
      // Retorna o botão atual para a lista de disponíveis
      onReturnButton(currentButton);
    }
  
    // Atualizar o array de droppedButtons com o novo botão no índice correto
    const newDroppedButtons = [...droppedButtons];
    newDroppedButtons[indexToDrop] = button;
    setDroppedButtons(newDroppedButtons);
  
    // Disparar o callback para onButtonDrop
    onButtonDrop(button);
  };
  
  

  return (
    <div className="flex flex-col w-[50%] h-[420px]">
      <h1>Selecione o botão</h1>
      <CardDescription>
        Selecione uma área e arraste o botão para a posição desejada
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
      <ScrollArea className="h-full border border-input mt-2 w-full">
        <div className="w-full flex flex-wrap gap-2 m-1">
          {buttonsToShow.length > 0
            ? buttonsToShow.map((button: ButtonInterface) => (
                <DraggableButton key={button.id} button={button}>
                  <div
                    onClick={() => {
                      handleClickButton(button);
                    }}
                  >
                    {renderButtonContent(button)}
                  </div>
                </DraggableButton>
              ))
            : renderSkeletons(buttonsFromUser.length)}
        </div>
      </ScrollArea>
    </div>
  );
}