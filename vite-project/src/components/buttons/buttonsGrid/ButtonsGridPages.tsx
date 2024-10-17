import { Card } from "@/components/ui/card";
import { ButtonInterface, useButtons } from "../buttonContext/ButtonsContext";
import ButtonsGrid from "./ButtonsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useContext, useEffect, useState } from "react";

import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";
import { useSensors } from "@/components/sensor/SensorContext";
import { AccountContext } from "@/components/account/AccountContext";
import {
  UserInterface,
  useUsers,
} from "@/components/users/usersCore/UserContext";
import { Check, Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useToast } from "@/components/ui/use-toast";
import { truncateText } from "@/components/utils/utilityFunctions";

interface ButtonsGridPagesProps {
  buttonsGrid: ButtonInterface[];
  selectedUser: UserInterface;
}

export default function ButtonsGridPages({
  buttonsGrid,
  selectedUser,
}: ButtonsGridPagesProps) {
  const [openEditPageIndex, setOpenEditPageIndex] = useState<number | null>(
    null
  ); // Controlar o estado do popover para cada página
  const [selectedPage, setSelectedPage] = useState("1"); // Inicialmente, a página 1 é selecionada.
  const { language } = useLanguage();
  const { buttons, setOldValue, setNewValue } = useButtons(); // todos botões do app
  const { buttonSensors } = useSensors();
  const [pageName, setPageName] = useState("");
  const { users } = useUsers();
  const buttonsInSelectedPage = buttonsGrid.filter(
    (buttonsGrid) => buttonsGrid.page.toString() === selectedPage
  ); // Filtrar botões com base na página selecionada.
  const { isAdmin, guid } = useContext(AccountContext);
  const wss = useWebSocketData();
  const { toast } = useToast();

  const filteredUser = users.filter((u) => {
    if (isAdmin) {
      return u.guid === selectedUser.guid;
    } else {
      return u.guid === guid;
    }
  })[0];

  const handlePageChange = (newPage: string) => {
    setSelectedPage(newPage); // Atualizar a página selecionada quando o usuário seleciona uma nova página.
  };

  const handleOpenPopover = (index: number) => {
    setOpenEditPageIndex(index); // Definir qual popover será aberto
  };

  const handleClosePopover = () => {
    setOpenEditPageIndex(null); // Fechar o popover
  };
  const handleSetPageName = (pageNumber: string) => {
    if (!pageName) {
      toast({
        variant: "destructive",
        description: "Por Favor escolha um nome para a página",
      });
      return;
    }
    wss.sendMessage({
      api: "admin",
      mt: "SetPageName",
      guid: selectedUser?.guid,
      pageName: pageName,
      pageNumber: pageNumber,
    });
  };

  const handleTypePageName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value);
  };

  // return (
  //   <div>
  //     <input
  //       value={input}
  //       placeholder={"Tap on the virtual keyboard to start"}
  //       onChange={(e) => onChangeInput(e)}
  //     />

  // use effect para piscar nas outras páginas sem ser a atual
  useEffect(() => {
    if (!buttons || buttons.length === 0 || isAdmin) return; // Verifica se buttons está definido e não vazio

    buttons.forEach((btns) => {
      // Itera sobre os botões
      if (btns.button_type === "sensor" && btns.page !== "0") {
        const filteredSensor = buttonSensors.find(
          (sensor) => sensor.deveui === btns.button_prt
        ); // Encontra o sensor correspondente
        if (filteredSensor && btns.sensor_type) {
          const currentValue = parseInt(
            (filteredSensor as any)[btns.sensor_type],
            10
          ); // Obtém o valor atual do sensor

          // Compara com os valores anteriores
          if (btns.newValue !== currentValue) {
            setOldValue(btns.sensor_type, btns.button_prt, btns.newValue); // Define o valor antigo antes de atualizar
            setNewValue(btns.sensor_type, btns.button_prt, currentValue); // Define o novo valor
          }
        }
      }
    });
  }, [buttonSensors]); // Dependências

  // Verifica se algum botão está em estado de alerta em uma página específica
  const isPageWarning = (pageNumber: string) => {
    return buttons.some((button) => {
      return button.page.toString() === pageNumber && button.triggered;
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
          {["1", "2", "3", "4", "5"].map((pageNumber, index) => (
            <TabsTrigger
              key={pageNumber}
              value={pageNumber}
              className="w-full gap-2"
            >
            {truncateText(
                filteredUser?.userPreferences?.[`page${pageNumber}`]
                  ? filteredUser?.userPreferences?.[`page${pageNumber}`]
                  : texts[language].page + " " + pageNumber,
                8
              )}
              {isPageWarning(pageNumber) && !isAdmin ? (
                <span className="relative flex h-3 w-3 m-1 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              ) : isAdmin ? (
                <div className="flex items-center justify-center">
                  <Popover
                    open={openEditPageIndex === index} // Abrir popover apenas para o índice correspondente
                    onOpenChange={(open) =>
                      open ? handleOpenPopover(index) : handleClosePopover()
                    } // Definir qual popover abrir/fechar
                  >
                    <PopoverTrigger>
                      <Pencil size="15px" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="relative flex flex-col items-left">
                        {/* <button
                          className="absolute top-0 right-0 -mt-5 -mr-5 h-6 w-6 rounded-full bg-card-foreground text-gray-600 hover:bg-gray-300 hover:text-black flex items-center justify-center"
                          onClick={handleClosePopover}
                        >
                          X
                      </button> */}
                        {/*  <div className="mb-2">Editar nome da Página</div> */}
                        <div className="flex flex-row items-center gap-3">
                          <div>
                            <Input
                              placeholder=
                                {truncateText(
                                  filteredUser?.userPreferences?.[`page${pageNumber}`]
                                    ? filteredUser?.userPreferences?.[`page${pageNumber}`]
                                    : texts[language].page + " " + pageNumber,
                                  20
                                )}
                              
                              onChange={handleTypePageName}
                              type="text"
                            />
                          </div>
                          <div
                            onClick={() => {
                              handleSetPageName(pageNumber);
                            }}
                          >
                            <Check />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                ""
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </Card>
  );
}
