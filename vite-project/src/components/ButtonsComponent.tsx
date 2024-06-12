import React, { useContext, useEffect } from "react";
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
import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSensors } from "./SensorContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ModalSensor from "./ModalSensor";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "./LanguageContext";
import ModalCombo from "./ModalCombo";
import { useWebSocketData } from "./WebSocketProvider";
import SensorResponsiveInfo from "./SensorResponsiveInfo";

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
  const language = useLanguage();
  const { sensors } = useSensors();
  const wss = useWebSocketData();
  const [isClicked, setIsClicked] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);

  useEffect(() => {
    if (button.button_type === "sensor") {
      wss?.sendMessage({
        api: "user",
        mt: "SelectSensorInfoSrc",
        sensor: button.button_prt,
        type: button.sensor_type,
      });
    }
  }, [button]);

  const handleClick = () => {
    if (isAdmin) {
      onClickPosition();
    }
    setIsClicked(!isClicked);
  };

  const getDialogContent = () => {
    //if (!clickedPosition) return null;

    switch (true) {
      case clickedPosition?.i === 1 && selectedPage !== "0":
        return (
          <ModalCombo
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
          />
        );
      case clickedPosition?.i === 2 && selectedPage !== "0":
        return (
          <ModalSensor
            selectedPage={selectedPage}
            selectedUser={selectedUser}
            clickedPosition={clickedPosition}
          />
        );
      case (clickedPosition?.i ?? 0) >= 3 && (clickedPosition?.i ?? 0) <= 8:
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
                  <Select>
                    <SelectTrigger className="col-span-1" id="SelectTypeButton">
                      <SelectValue placeholder="Selecione o tipo de Botão" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="alarm">Alarme</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </>
        );
      default:
        return (
          <>
            <DialogTitle>Criar um botão</DialogTitle>
          </>
        );
    }
  };

  const commonClasses =
    "w-[128px] h-[55px] rounded-lg border bg-border text-white shadow-sm p-1";

  const renderButtonContent = () => {
    switch (button.button_type) {
      case "alarm":
        return (
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className={`${commonClasses} flex flex-col cursor-pointer bg-buttonNumber`}
                  onClick={handleClick}
                >
                  <div className="flex items-center gap-1 cursor-pointer">
                    <OctagonAlert />
                    <p className="text-sm font-medium leading-none">
                      {button.button_name}
                    </p>
                  </div>
                  <div>
                    <p>{button.button_prt}</p>
                  </div>
                </div>
              </DialogTrigger>
              {isAdmin && (
                <DialogContent>
                  {/* <CardSensorModal
                  selectedPage={selectedPage}
                  selectedUser={selectedUser}
                  clickedPosition={clickedPosition}
                  existingButton={button}
                  isUpdate={true}
                /> */}
                </DialogContent>
              )}
            </Dialog>
          </div>
        );
      case "user":
        return (
          <div
            className={`${commonClasses} flex flex-col bg-buttonNumber`}
            onClick={handleClick}
          >
            <div className="flex items-center gap-1">
              <User />
              <p className="text-sm font-medium leading-none">
                {button.button_name}{" "}
              </p>
            </div>
            <div>
              <p>{button.button_prt}</p>
            </div>
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
          <div className={`${commonClasses} flex`} onClick={handleClick}>
            <div className="flex items-center gap-1">
              <Layers3 />
              <p className="text-sm font-medium leading-none">Nome </p>
            </div>
          </div>
        );
      case "sensor":
        return (
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className={`${commonClasses} flex flex-col cursor-pointer active:bg-red-900 bg-buttonSensor`}
                  onClick={handleClick}
                >
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Rss size={20} />
                    <div>
                      <p className="text-md font-medium leading-none">
                        {button.button_name}
                      </p>
                      <p className="text-[10px] font-medium leading-none text-muted-foreground">
                        {button.button_prt}
                      </p>
                    </div>
                  </div>
                  <SensorResponsiveInfo button={button} />
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
              {<DialogContent>{getDialogContent()}</DialogContent>}
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
