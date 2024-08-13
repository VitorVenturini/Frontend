import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface, useButtons } from "../buttonContext/ButtonsContext";
import ButtonsGrid from "./ButtonsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useContext, useEffect, useState } from "react";

import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";
import { checkButtonWarning } from "@/components/utils/utilityFunctions";
import { useSensors } from "@/components/sensor/SensorContext";
import { AccountContext } from "@/components/account/AccountContext";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

interface ButtonsGridPagesProps {
  buttonsGrid: ButtonInterface[];
  selectedUser: User;
}

export default function ButtonsGridPages({
  buttonsGrid,
  selectedUser,
}: ButtonsGridPagesProps) {
  const [selectedPage, setSelectedPage] = useState("1"); // Inicialmente, a página 1 é selecionada.
  const { language } = useLanguage();
  const {buttons,setOldValue,setNewValue} = useButtons() // todos botões do app
  const {buttonSensors} = useSensors()
  const buttonsInSelectedPage = buttonsGrid.filter(
    (buttonsGrid) => buttonsGrid.page.toString() === selectedPage
  ); // Filtrar botões com base na página selecionada.
  const { isAdmin } = useContext(AccountContext);

  const handlePageChange = (newPage: string) => {
    setSelectedPage(newPage); // Atualizar a página selecionada quando o usuário seleciona uma nova página.
  };

  //use effect para piscar nas outras páginas sem ser a atual
  // useEffect(() => {
  //   if (!buttons || buttons.length === 0 || isAdmin ) return; // Verifica se buttons está definido e não vazio

  //   buttons.forEach((btns) => {
  //     // Itera sobre os botões
  //     if (btns.button_type === "sensor" && btns.page !== "0") {
  //       const filteredSensor = buttonSensors.find(
  //         (sensor) => sensor.deveui === btns.button_prt
  //       ); // Encontra o sensor correspondente
  //       console.log("FILTEREDSENSORS" + JSON.stringify(filteredSensor))
  //       if (filteredSensor && btns.sensor_type) {
  //         const currentValue = parseInt(
  //           (filteredSensor as any)[btns.sensor_type],
  //           10
  //         ); // Obtém o valor atual do sensor

  //         // Compara com os valores anteriores
  //         if (btns.newValue !== currentValue) {
  //           setOldValue(btns.sensor_type, btns.button_prt, btns.newValue); // Define o valor antigo antes de atualizar
  //           setNewValue(btns.sensor_type, btns.button_prt, currentValue); // Define o novo valor
  //         }
  //       }else{
  //         return
  //       }
  //     }
  //   });
  // }, [buttonSensors]); // Dependências

 
// Verifica se algum botão está em estado de alerta em uma página específica
const isPageWarning = (pageNumber: string) => {
  return buttons.some((button) => {
    return (
      button.page.toString() === pageNumber &&
      checkButtonWarning(button, button.newValue)
    );
  });
};

  return (
    <Card className="p-1 flex flex-col gap-1 justify-between">
      <div className="w-full space-y-1 ">
        <ButtonsGrid
          buttons={buttonsInSelectedPage}
          selectedUser={selectedUser}
          selectedPage={selectedPage}
        />
      </div>
      <Tabs
        defaultValue="1"
        onValueChange={handlePageChange}
        className="w-full "
      >
        <TabsList className="w-full flex justify-center ">
          {["1", "2", "3", "4", "5"].map((pageNumber) => (
            <TabsTrigger key={pageNumber} value={pageNumber} className="w-full">
              {texts[language].page} {pageNumber}
              {isPageWarning(pageNumber) ? (
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
