import { useContext, useEffect } from "react";
import {
  Plus,
} from "lucide-react";
import { AccountContext } from "../account/AccountContext";
import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { useState } from "react";
import SensorButton from "../sensor/SensorButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ModalSensor from "../sensor/ModalSensor";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModalAlarm from "@/components/buttons/alarm/ModalAlarm";
import AlarmButton from "@/components/buttons/alarm/AlarmButton";
import ModalCombo from "@/components/buttons/combo/ModalCombo";
import ComboButton from "./combo/ComboButton";
import ModalCommand from "./command/ModalCommand";
import CommandButton from "./command/CommandButton";
import ModalCronometer from "./cronometer/modalCronometer";
import CronometerButton from "./cronometer/cronometerButton";
import ModalUser from "./user/ModalUser";
import UserButton from "./user/UserButton";
import ModalNumber from "./number/ModalNumber";
import NumberButton from "./number/NumberButton";
import ModalClock from "./Clock/ModalClock";
import ClockButton from "./Clock/ClockButton";
import { useSearchParams } from "react-router-dom";
import { useSensors } from "../sensor/SensorContext";
import { UserInterface } from "../users/usersCore/UserContext";

interface ButtonProps {
  button: ButtonInterface;
  onClickPosition: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
}
export const commonClasses =
  "w-[128px] h-[70px] xl:w-[128px] xl:h-[77px] xl2:w-[150px] xl2:h-[90px] xl3:w-[190px] xl3:h-[112px] xl4:w-[230px] xl4:h-[139px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 justify-between";

export default function ButtonsComponent({
  button,
  onClickPosition,
  clickedPosition,
  selectedUser,
  selectedPage,
}: ButtonProps) {
  const { isAdmin } = useContext(AccountContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

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
        case "cronometer":
          return (
            <ModalCronometer
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
      case "number":
        return (
          <ModalNumber
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
        case "clock":
          return (
            <ModalClock
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
          <div className="">
            <Card className="border-none bg-transparent">
              <CardHeader>
                <CardTitle>Criar Botão</CardTitle>
                <CardDescription>Selecione um tipo de botão</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <div className=" grid grid-cols-5 items-center gap-4 mt-3 mb-6">
                  <Label
                    className="text-end"
                    htmlFor="framework"
                    id="typeButton"
                  >
                    Tipo de botão
                  </Label>
                  <Select onValueChange={handleTypeSelected}>
                    <SelectTrigger className="col-span-4" id="SelectTypeButton">
                      <SelectValue placeholder="Selecione o tipo de Botão" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="alarm">Alarme</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="command">Comando</SelectItem>
                      <SelectItem value="clock">Relógio</SelectItem>
                      <SelectItem value="cronometer">Cronometro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-6">{renderModalByType()}</div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        break;
    }
  };

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
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <NumberButton button={button} onClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <DialogContent>
                  {
                    <ModalNumber
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
                <DialogContent className="max-w-5xl">
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
                <div >
                  <DialogContent className="max-w-5xl"  >
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
        case "clock":
          return (
            <div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div>
                    <ClockButton button={button} handleClick={handleClick} />
                  </div>
                </DialogTrigger>
                {isAdmin && (
                  <div>
                    <DialogContent>
                      <ModalClock
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
          case "cronometer":
            return (
              <div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <div>
                      <CronometerButton button={button} handleClick={handleClick} />
                    </div>
                  </DialogTrigger>
                  {isAdmin && (
                    <div>
                      <DialogContent>
                        <ModalCronometer
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
              <DialogTrigger className="flex justify-center">
                <div
                  className={`${commonClasses} flex items-center `}
                  onClick={handleClick}
                >
                  <div className="flex w-full items-center justify-center">
                  <Plus />
                  </div>
                  
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">{getDialogContent()}</DialogContent>
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