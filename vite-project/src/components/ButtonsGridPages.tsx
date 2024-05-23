import { useAccount } from "@/components/AccountContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OtpRow from "@/components/OptRow";

import { ButtonInterface } from "./ButtonsContext";
import ButtonsGrid from "./ButtonsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useContext } from "react";

// interface accountSelect {
//     id: string;
//     name: string;
//     // Adicione outras propriedades do usuário conforme necessário
//   }

interface ButtonsGridPagesProps {
  buttons: ButtonInterface[];
}

export default function ButtonsGridPages({ buttons }: ButtonsGridPagesProps) {
  const [selectedPage, setSelectedPage] = useState("1"); // Inicialmente, a página 1 é selecionada. Note que agora é uma string.

  const buttonsInSelectedPage = buttons.filter(
    (button) => button.page.toString() === selectedPage
  ); // Filtrar botões com base na página selecionada. Converta a página para string.

  const handlePageChange = (newPage: string) => {
    setSelectedPage(newPage); // Atualizar a página selecionada quando o usuário seleciona uma nova página. Note que agora é uma string.
  };

  return (
    <Card className="p-3 min-w-[644px] flex flex-col max-w-[800px] gap-3 items-center">
      <div className="flex-grow w-full">
        <ButtonsGrid buttons={buttonsInSelectedPage} />
      </div>
      <OtpRow />
      <Tabs
        defaultValue="1"
        onValueChange={handlePageChange}
        className="w-full flex-grow"
      >
        <TabsList className="w-full flex justify-center">
          {["1", "2", "3", "4", "5"].map((pageNumber) => (
            <TabsTrigger key={pageNumber} value={pageNumber}>
              Página {pageNumber}
            </TabsTrigger>
          ))}
        </TabsList>
        {["1", "2", "3", "4", "5"].map((pageNumber) => (
          <TabsContent className="w-full flex-gow" key={pageNumber} value={pageNumber}></TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
