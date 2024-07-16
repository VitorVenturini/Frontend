import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";
import { Loader2, Pencil } from "lucide-react";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useSensors } from "@/components/sensor/SensorContext";
import { ActionsInteface } from "./ActionsContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import CardExecActions from "./CardExecActions";
import CardTriggerActions from "./CardTriggerActions";
import { setPriority } from "os";
interface User {
  id: string;
  name: string;
  guid: string;
}

interface UpdateActionsProps {
  action?: ActionsInteface;
  isUpdate?: boolean;
  onSuccess?: () => void;
}

export default function CardCreateAction({
  action,
  isUpdate = false,
  onSuccess
}: UpdateActionsProps) {
  const [actionName, setActionName] = useState(action?.action_name || "");
  const [priority, setPriority]= useState('')
  const [isCreating, setIsCreating] = useState(false);

  const [triggerActionDetails, setTriggerActionDetails] = useState({
    actionStartPrt: action?.action_start_prt || "",
    actionStartType: action?.action_start_type || "",
    actionStartDevicePrt: action?.action_start_device_parameter || "",
    actionStartDevice: action?.action_start_device || "",
  });

  const [execActionDetails, setExecActionDetails] = useState({
    actionExecType: action?.action_exec_type || "",
    selectedUser: action?.action_exec_user || "",
    actionExecDevice: action?.action_exec_device || "",
    actionExecPrt: action?.action_exec_prt || "",
    actionExecTypeCommandMode: action?.action_exec_type_command_mode || "",
  });
  const handleUpdateTriggerActionDetails = (key: string, value: string) => {
    setTriggerActionDetails((prevDetails) => ({ ...prevDetails, [key]: value }));
  };
  const handleUpdateExecActionDetails = (key: string, value: string) => {
    setExecActionDetails((prevDetails) => ({ ...prevDetails, [key]: value }));
  };
  const handlePriority = (value: string) => {
    setPriority(value)
  }

  const wss = useWebSocketData();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { sensors } = useSensors();
  const { buttons } = useButtons();

  const handleActionName = (event: ChangeEvent<HTMLInputElement>) => {
    setActionName(event.target.value);
  };

  // parametros para enviar
  //
  // execType: execActionDetails.actionExecType,
  // execDevice: execActionDetails.actionExecDevice,
  // commandMode: execActionDetails.actionExecTypeCommandMode,
  // execPrt: execActionDetails.actionExecPrt,

  const handleCreateAction = () => {

    if (actionName && triggerActionDetails.actionStartPrt && triggerActionDetails.actionStartType && execActionDetails.actionExecType) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateAction" : "InsertAction",
        ...(isUpdate && { id: action?.id }),
        name: actionName,
        startPrt: triggerActionDetails.actionStartPrt,
        startType: triggerActionDetails.actionStartType,
        startDevicePrt: triggerActionDetails.actionStartDevicePrt,
        startDevice: triggerActionDetails.actionStartDevice,
        guid: execActionDetails.selectedUser,
        execType: execActionDetails.actionExecType,
        execDevice: execActionDetails.actionExecDevice,
        commandMode: execActionDetails.actionExecTypeCommandMode,
        execPrt: execActionDetails.actionExecPrt,
      });
      setIsCreating(false);
      setActionName("");
      onSuccess?.();
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes de criar o botão.",
      });
    }
  };

  return (
    //div que contem os cards
    <div className="w-full">
      <CardHeader>
        <CardTitle>{isUpdate == true ? (
          "Update Action"
        ) : (
          "Create Action"
        )}</CardTitle>
        <CardDescription>{isUpdate == true ? (
          "Update TEXT Action"
        ) : (
          "Create TEXT Action"
        )}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Card de criação da ação */}
        <div className="w-full">
          <div className="grid gap-4 p-4">
            <CardDescription>Action Name</CardDescription>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome da ação
              </Label>
              <Input
                className="col-span-5"
                id="name"
                placeholder="Nome da ação"
                type="text"
                value={actionName}
                onChange={handleActionName}
              />
            </div>
          </div>
          <div className="flex columns gap-4 p-4 justify-between">
            {/*div parametro Trigger */}
            <CardTriggerActions action={action}
            onUpdateTriggerActionDetails={handleUpdateTriggerActionDetails}
             />
            {/* END div parametro Trigger */}

            {/*div parametro execução */}
            <CardExecActions
              action={action}
              onUpdateExecActionDetails={handleUpdateExecActionDetails}
            />
            {/* END div parametro execução */}
          </div>
          <CardFooter className="flex justify-end">
            {!isCreating && (
              <Button onClick={handleCreateAction}>Criar Ação</Button>
            )}
            {isCreating && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criar Ação
              </Button>
            )}
          </CardFooter>
        </div>
      </CardContent>
    </div>
  );
}
