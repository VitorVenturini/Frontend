import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "../buttonContext/ButtonsContext";
import ButtonsGrid from "./ButtonsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useContext } from "react";
import OptBar from "@/components/optBar/OptBar"
import { useLanguage } from "@/components/language/LanguageContext"
import texts from "@/_data/texts.json";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface ButtonsGridPagesProps {
  buttons: ButtonInterface[];
  selectedUser: User;
  selectedOpt: string;
  onOptChange: (newOpt: string) => void;
  clickedUser?: string | null;
}

export default function ButtonsGridPages({
  buttons,
  selectedUser,
  onOptChange,
  selectedOpt,
  clickedUser
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


    <Card className="p-1 flex flex-col gap-1">
      <div className="w-full space-y-1">
        <ButtonsGrid
          buttons={buttonsInSelectedPage}
          selectedUser={selectedUser}
          selectedPage={selectedPage}
        />
        <OptBar onOptChange={handleOptChange} clickedUser={clickedUser} selectedOpt ={selectedOpt} />
      </div>
      <Tabs
        defaultValue="1"
        onValueChange={handlePageChange}
        className="w-full "
      >
        <TabsList className="w-full flex justify-center ">
          {["1", "2", "3", "4", "5"].map((pageNumber) => (
            <TabsTrigger
              key={pageNumber}
              value={pageNumber}
              className="w-full"
            >
              {texts[language].page} {pageNumber}
              {buttonsWarning.some((button) => button.page === pageNumber) ? (
                <span className="relative flex h-3 w-3 m-1 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              ) : (
                ""
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {["1", "2", "3", "4", "5"].map((pageNumber) => (
          <TabsContent
            className="w-full "

            key={pageNumber}
            value={pageNumber}
          ></TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
