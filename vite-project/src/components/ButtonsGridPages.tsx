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
import  ButtonsGrid  from "./ButtonsGrid";
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
    <Card className="p-5 min-w-[644px]">
      <div className=" place-content-around">
        <div>
          <ButtonsGrid buttons={buttonsInSelectedPage} />
        </div>
        <OtpRow />
        <Tabs
          defaultValue="1"
          onValueChange={handlePageChange}
          className="w-[400px]"
        >
          <TabsList>
            {["1", "2", "3", "4", "5"].map((pageNumber) => (
              <TabsTrigger key={pageNumber} value={pageNumber}>
                Página {pageNumber}
              </TabsTrigger>
            ))}
          </TabsList>
          {["1", "2", "3", "4", "5"].map((pageNumber) => (
            <TabsContent key={pageNumber} value={pageNumber}></TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
}
