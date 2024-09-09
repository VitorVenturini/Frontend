import React, { ChangeEvent, useState } from "react";
import { useButtons, ButtonInterface } from "../buttonContext/ButtonsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardDescription } from "@/components/ui/card";
import { commonClasses } from "../ButtonsComponent";
import { UserInterface } from "@/components/users/usersCore/UserContext";
import AlarmButton from "../alarm/AlarmButton";
import SensorButton from "@/components/sensor/SensorButton";
import CommandButton from "../command/CommandButton";
import NumberButton from "../number/NumberButton";
import UserButton from "../user/UserButton";

interface ComboCardButtonsProps {
  selectedUser: UserInterface | null;
}
export default function ComboCardButtons({
  selectedUser,
}: ComboCardButtonsProps) {
  const [filteredButtons, setFilterButtons] = useState("");
  const { buttons } = useButtons(); // Obtém os botões do contexto

  const buttonsFromUser = buttons.filter((btn) => {
    return btn.button_user === selectedUser?.guid;
  });

  // Função para lidar com a entrada do filtro
  const handleFilterButtons = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterButtons(event.target.value);
  };

  // Função para normalizar strings removendo acentos
  const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
  };

  // Filtra os botões com base no valor inserido no filtro
  const buttonsToShow = buttonsFromUser.filter((button: ButtonInterface) => {
    const normalizedButtonName = normalizeString(
      button.button_name.toLowerCase()
    );
    const normalizedFilter = normalizeString(filteredButtons.toLowerCase());
    return (
      normalizedButtonName.includes(normalizedFilter) &&
      button.button_type !== "combo"
    );
  });

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

      {/* ScrollArea para exibir os botões filtrados */}
      <ScrollArea className="h-[150px] border border-input mt-4 w-full">
        <div className="w-full flex flex-wrap gap-2">
          {buttonsToShow.map((button: ButtonInterface) => {
            switch (button.button_type) {
              case "alarm":
                return <AlarmButton key={button.id} button={button} />;
              case "sensor":
                return <SensorButton key={button.id} button={button} />;
              case "command":
                return <CommandButton key={button.id} button={button} />;
              case "number":
                return <NumberButton key={button.id} button={button} />;
              case "user":
                return <UserButton key={button.id} button={button} />;
              default:
                return (
                  <div key={button.id} className={`${commonClasses} `}>
                    <div className="flex-col flex">
                      <div className="font-bold">{button.button_name}</div>
                      <div className="text-sm text-muted-foreground">{button.button_type} </div>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
