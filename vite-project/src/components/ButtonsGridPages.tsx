import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "./ButtonsContext";
import ButtonsGrid from "./ButtonsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useContext } from "react";
import OptBar from "./OptBar";
import { useLanguage } from "./LanguageContext";
import texts from "../_data/texts.json";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface ButtonsGridPagesProps {
  buttons: ButtonInterface[];
  selectedUser: User;
  onOptChange: (newOpt: string) => void;
}

export default function ButtonsGridPages({
  buttons,
  selectedUser,
  onOptChange,
}: ButtonsGridPagesProps) {
  const [selectedPage, setSelectedPage] = useState("1"); // Inicialmente, a página 1 é selecionada. Note que agora é uma string.
  const { language } = useLanguage();

  const buttonsInSelectedPage = buttons.filter(
    (button) => button.page.toString() === selectedPage
  ); // Filtrar botões com base na página selecionada. Converta a página para string.

  const handlePageChange = (newPage: string) => {
    setSelectedPage(newPage); // Atualizar a página selecionada quando o usuário seleciona uma nova página. Note que agora é uma string.
  };

  const handleOptChange = (newOpt: string) => {
    onOptChange(newOpt);
  };

  const buttonsWarning = buttons.filter(
    (button) =>
      parseInt(button?.newValue as any) >
      parseInt(button?.sensor_max_threshold as any)
  );

  return (


    <Card className="p-1 flex flex-col gap-1 items-center justify-center ">
      <div className="flex-grow w-full">
        <ButtonsGrid
          buttons={buttonsInSelectedPage}
          selectedUser={selectedUser}
          selectedPage={selectedPage}
        />
        <br />
        <OptBar onOptChange={handleOptChange} />
      </div>
      <Tabs
        defaultValue="1"
        onValueChange={handlePageChange}
        className="w-full flex-grow "
      >
        <TabsList className="w-full flex justify-center ">
          {["1", "2", "3", "4", "5"].map((pageNumber) => (
            <TabsTrigger
              key={pageNumber}
              value={pageNumber}
              className={`${
                buttonsWarning.some((button) => button.page === pageNumber)
                  ? "blinking-background"
                  : ""
              }`}
            >
              {texts[language].page} {pageNumber}
            </TabsTrigger>
          ))}
        </TabsList>
        {["1", "2", "3", "4", "5"].map((pageNumber) => (
          <TabsContent
            className="w-full flex-gow "
            key={pageNumber}
            value={pageNumber}
          ></TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
