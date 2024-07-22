import React, { useContext, useEffect, useMemo } from "react";
import {
  Plus,
  OctagonAlert,
  User,
  Phone,
  Layers3,
  Rss,
  CircleArrowUp,
  Siren,
} from "lucide-react";
import { AccountContext } from "../account/AccountContext";
import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { useState } from "react";
import { Button } from "../ui/button";
import SensorButton from "../sensor/SensorButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSensors } from "../sensor/SensorContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ModalSensor from "../sensor/ModalSensor";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "../language/LanguageContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import ModalAlarm from "@/components/buttons/alarm/ModalAlarm";
import AlarmButton from "@/components/buttons/alarm/AlarmButton";
import SensorResponsiveInfo from "../sensor/SensorResponsiveInfo";
import ModalCombo from "@/components/buttons/combo/ModalCombo";
import ComboButton from "./combo/ComboButton";
import ModalCommand from "./command/ModalCommand";
import CommandButton from "./command/CommandButton";
import ModalUser from "./user/ModalUser";
import UserButton from "./user/UserButton";
interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

interface ButtonProps {
  button: ButtonInterface;
  onClickPosition: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: User | null;
  selectedPage: string;
}

export default function ButtonsComponent({
  button,
  onClickPosition,
  clickedPosition,
  selectedUser,
  selectedPage,
}: ButtonProps) {
  const { isAdmin } = useContext(AccountContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const language = useLanguage();
  const { sensors } = useSensors();
  const wss = useWebSocketData();
  const [isClicked, setIsClicked] = useState(false);
  // const { setOldValue, setNewValue, buttons, setButtons } = useButtons();
  const [selectedType, setSelectedType] = useState<string>("");

  // para piscar nas outras páginas sem ser a atual
  // useEffect(() => {
  //   if (!buttons || buttons.length === 0 || isAdmin) return; // Verifica se buttons está definido e não vazio

  //   buttons.forEach((btns) => {
  //     // Itera sobre os botões
  //     if (btns.button_type === "sensor" && btns.page !== "0") {
  //       const filteredSensor = sensors.find(
  //         (sensor) => sensor.sensor_name === btns.button_prt
  //       ); // Encontra o sensor correspondente

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
  //       }
  //     }
  //   });
  // }, [sensors, buttons, setOldValue, setNewValue]); // Dependências

  const handleClick = () => {
    if (isAdmin) {
      onClickPosition();
      setSelectedType(""); // limpeza q faltava
    }
    setIsClicked(!isClicked);
  };

  const handleTypeSelected = (value: string) => {
    setSelectedType(value);
  };
  // função para abrir o modal Alarm , number , user de acordo com a opção selecionada
  const renderModalByType = () => {
    switch (selectedType) {
      case "alarm":
        return (
          <ModalAlarm
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
      case "user":
        return (
          <ModalUser
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
      case "sensor":
        return (
          <ModalSensor
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
      case "command":
        return (
          <ModalCommand
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
      // Add other cases here as needed
      default:
        return null;
    }
  };

  const getDialogContent = () => {
    //if (!clickedPosition) return null;
    switch (true) {
      case clickedPosition?.i === 1 &&
        clickedPosition.j >= 1 &&
        clickedPosition.j <= 5:
        return (
          <ModalCombo
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
      case clickedPosition &&
        clickedPosition?.i >= 2 &&
        clickedPosition?.i <= 8 &&
        clickedPosition?.j >= 1 &&
        clickedPosition?.j <= 5:
        return (
          <>
            <Card className="border-none bg-transparent">
              <CardHeader>
                <CardTitle>Criar Botão</CardTitle>
                <CardDescription>Selecione um tipo de botão</CardDescription>
              </CardHeader>
              <CardContent className="gap-4 py-4">
                <div className="flex gap-4 items-center">
                  <Label
                    className="text-end"
                    htmlFor="framework"
                    id="typeButton"
                  >
                    Tipo de botão
                  </Label>
                  <Select onValueChange={handleTypeSelected}>
                    <SelectTrigger className="col-span-1" id="SelectTypeButton">
                      <SelectValue placeholder="Selecione o tipo de Botão" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="alarm">Alarme</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="command">Comando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>{renderModalByType()}</div>
              </CardContent>
            </Card>
          </>
        );
      default:
        break;
    }
    // if (clickedPosition?.i === 1 && clickedPosition.j >= 1 && clickedPosition.j <= 5) {
    //   return (
    //     <ModalCombo
    //       selectedPage={selectedPage}
    //       selectedUser={selectedUser}
    //       clickedPosition={clickedPosition}
    //     />
    //   );
    // } else {
    //   return (
    //     <>
    //       <Card className="border-none bg-transparent">
    //         <CardHeader>
    //           <CardTitle>Criar Botão</CardTitle>
    //           <CardDescription>Selecione um tipo de botão</CardDescription>
    //         </CardHeader>
    //         <CardContent className="gap-4 py-4">
    //           <div className="flex gap-4 items-center">
    //             <Label className="text-end" htmlFor="framework" id="typeButton">
    //               Tipo de botão
    //             </Label>
    //             <Select onValueChange={handleTypeSelected}>
    //               <SelectTrigger className="col-span-1" id="SelectTypeButton">
    //                 <SelectValue placeholder="Selecione o tipo de Botão" />
    //               </SelectTrigger>
    //               <SelectContent position="popper">
    //                 <SelectItem value="alarm">Alarme</SelectItem>
    //                 <SelectItem value="number">Número</SelectItem>
    //                 <SelectItem value="user">Usuário</SelectItem>
    //                 <SelectItem value="sensor">Sensor</SelectItem>
    //                 <SelectItem value="action">Ação</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //           <div>{renderModalByType()}</div>
    //         </CardContent>
    //       </Card>
    //     </>
    //   );
    // }
  };

  const commonClasses =
    "w-[128px] h-[55px] xl:w-[150px] xl:h-[80px] rounded-lg border bg-border text-white shadow-sm p-1";

  const renderButtonContent = () => {
    switch (button.button_type) {
      case "alarm":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <AlarmButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <DialogContent>
                  {
                    <ModalAlarm
                      selectedPage={selectedPage}
                      selectedUser={selectedUser}
                      clickedPosition={clickedPosition}
                      existingButton={button}
                      isUpdate={true}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  }
                </DialogContent>
              )}
            </Dialog>
          </div>
        );
      case "user":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <UserButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <DialogContent>
                  {
                    <ModalUser
                      selectedPage={selectedPage}
                      selectedUser={selectedUser}
                      clickedPosition={clickedPosition}
                      existingButton={button}
                      isUpdate={true}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  }
                </DialogContent>
              )}
            </Dialog>
          </div>
        );
      case "number":
        return (
          <div
            className={`${commonClasses} flex flex-col bg-buttonNumber`}
            onClick={handleClick}
          >
            <div className="flex items-center bg gap-1 bg">
              <Phone />
              <p className="text-xs font-medium leading-none">
                {button.button_name}{" "}
              </p>
            </div>
            <div>
              <p className="align-middle text-center">{button.button_prt}</p>
            </div>
          </div>
        );
      case "combo":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <ComboButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <DialogContent>
                  {
                    <ModalCombo
                      selectedPage={selectedPage}
                      selectedUser={selectedUser}
                      clickedPosition={clickedPosition}
                      existingButton={button}
                      isUpdate={true}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  }
                </DialogContent>
              )}
            </Dialog>
          </div>
        );
      case "sensor":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <SensorButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <div>
                  <DialogContent>
                    <ModalSensor
                      selectedPage={selectedPage}
                      selectedUser={selectedUser}
                      clickedPosition={clickedPosition}
                      existingButton={button}
                      isUpdate={true}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  </DialogContent>
                </div>
              )}
            </Dialog>
          </div>
        );
      case "command":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <CommandButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <div>
                  <DialogContent>
                    <ModalCommand
                      selectedPage={selectedPage}
                      selectedUser={selectedUser}
                      clickedPosition={clickedPosition}
                      existingButton={button}
                      isUpdate={true}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  </DialogContent>
                </div>
              )}
            </Dialog>
          </div>
        );
      default:
        if (isAdmin) {
          return (
            // <div>
            // {getDialogContent()}
            // </div>
            <Dialog>
              <DialogTrigger>
                <div
                  className={`${commonClasses} flex items-center justify-center`}
                  onClick={handleClick}
                >
                  <Plus />
                </div>
              </DialogTrigger>
              <DialogContent>{getDialogContent()}</DialogContent>
            </Dialog>
          );
        } else {
          return (
            <div
              className={`${commonClasses} flex items-center justify-center`}
            ></div>
          );
        }
    }
  };

  return renderButtonContent();
}
