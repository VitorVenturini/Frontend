import { useContext, useEffect } from "react";
import { Plus } from "lucide-react";
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

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import ModalConference from "./conference/ModalConference";
import ConferenceButton from "./conference/ConferenceButton";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { useDrop } from "react-dnd";
import ModalFlic from "./flic/ModalFlic";
import FlicButton from "./flic/FlicButton";

interface ButtonProps {
  button: ButtonInterface;
  onClickPosition: () => void; // Adicione esta linha
  clickedPosition: { i: number; j: number } | null;
  selectedUser: UserInterface | null;
  selectedPage: string;
}

interface DraggedItem {
  call: any;
}

export const commonClasses =
  "w-[128px] h-[70px] xl:w-[128px] xl:h-[77px] xl2:w-[150px] xl2:h-[90px] xl3:w-[190px] xl3:h-[112px] xl4:w-[230px] xl4:h-[139px] text-white rounded-lg border bg-border shadow-sm p-1 justify-between";

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
  const wss = useWebSocketData();

  //drop
  const useDropWithButtonId = (btn_id: number | null, isEnabled: boolean) => {
    return useDrop(
      () => ({
        accept: "CALL",
        drop: (item: any) => {
          if (isEnabled && btn_id) {
            const draggedItem = item as DraggedItem;

            // Enviar mensagem ao WebSocket com o btn_id correto
            wss?.sendMessage({
              api: "user",
              mt: "TriggerConference",
              btn_id: btn_id, // Usar o valor do botão passado como parâmetro
              calls: [draggedItem.call.callId], // O ID da chamada que foi arrastada
            });
          }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
      }),
      [btn_id, isEnabled]
    );
  };

  const [{ isOver }, drop] = useDropWithButtonId(
    button?.id,
    button?.button_type === "conference" && !isAdmin
  );

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
      case "flic":
        return (
          <ModalFlic
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
      case "conference":
        return (
          <ModalConference
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
            onClose={() => setIsDialogOpen(false)}
          />
        );
      // Add other cases here as needed
      default:
        return (
          <div className="flex justify-center items-center h-full w-full min-h-[200px]">
            <p className="">selecione um tipo de botão</p>
          </div>
        );
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
            <Card className="border-none bg-transparent min-w-[500px]">
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
                      <SelectItem value="flic">Flic</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="command">Comando</SelectItem>
                      <SelectItem value="clock">Relógio</SelectItem>
                      <SelectItem value="cronometer">Cronometro</SelectItem>
                      <SelectItem value="conference">Conferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Card className="space-y-6 min-h-[250px] flex flex-col content-between p-0">
                  {renderModalByType()}
                </Card>
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
                <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
      case "flic":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <FlicButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
                  {
                    <ModalFlic
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
                <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
                <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[900px]">
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
                <DialogContent className="max-w-5xl space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
                  <DialogContent className="max-w-5xl space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
                  <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
                  <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
                  <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
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
      case "conference":
        return (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div
                  ref={isAdmin ? null : drop} // Aplicar ref apenas se for admin
                  style={{
                    backgroundColor: isOver ? "lightgreen" : "white", // Feedback visual
                  }}
                >
                  <ConferenceButton button={button} handleClick={handleClick} />
                </div>
              </DialogTrigger>
              {isAdmin && (
                <div>
                  <DialogContent className="space-y-6 min-h-[250px] flex flex-col content-between p-0 min-w-[600px]">
                    <ModalConference
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
              <DialogContent className="max-w-5xl">
                {getDialogContent()}
              </DialogContent>
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
